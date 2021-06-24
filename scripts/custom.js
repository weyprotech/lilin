/** 
 * Created by Tuko on 2016/7/14. *  
 */
var website = (function () {
    var site_url, base_url;

    function init() {
        $("ul#locale").delegate("a", "click", function () {
            var lang = $(this).data("lang");
            if (lang) change_lang(lang);
        });

        $("form").delegate("a.mail-btn", "click", function () {
            var formId = $(this).data("form");
            var $form = $("#" + formId);

            return $.ajax({
                url: $form.attr("action"),
                type: "POST",
                data: $form.serializeArray(),
                dataType: 'JSON',
                success: function (response) {
                    alert(response["message"]);
                    if (response['status']) {
                        document.getElementById(formId).reset();
                    }
                }
            });
        }).delegate("a.search-btn", "click", function () {
            var $form = $(this).parents("form#search-form:first");
            if ($form.find("input").val() == "") {
                return false;
            } else {
                $form.submit();
            }
        });

        $("#file-list").delegate("select.download-select", "change", function () {
            var filePath = $(this).data('path');
            var lang = $(this).val();

            if (lang) {
                location.href = website.site_url("support/file/download/" + filePath.replace(/lang/, lang.toUpperCase()));
                /*var $ifrm = $("<iframe style='display:none' />");
                 $ifrm.attr("src", website.site_url("support/file/download/" + filePath.replace(/lang/, lang.toUpperCase())));
                 $ifrm.appendTo("body");
                 $ifrm.load(function (e) {
                 console.log(e);
                 alert("Failed to download!");
                 });*/
                return true;
            }
            return false;
        });
    }

    function change_lang(lang) {
        return $.ajax({
            url: website.site_url('ajax/locale'),
            type: 'GET',
            data: { lang: lang, url: location.href },
            dataType: 'JSON',
            success: function (response) {
                if (response['status']) {
                    location.href = response['url'];
                }
            }
        });
    }

    return {
        init: init,
        set_url: function (url, base) {
            site_url = url;
            base_url = base;
        },
        site_url: function (url) {
            return site_url + '/' + url;
        },
        base_url: function (url) {
            return base_url + url;
        }
    };
})();

var Product = (function () {
    var $pdf = $("#pdf"), $modelList = $("#model-list");
    var exportUrl;

    function init() {
        if ($modelList.length) {
            exportUrl = $pdf.attr("href");
            $pdf.attr("href", exportUrl + "/" + $modelList.find("input:checked").val());
        }

        $modelList.delegate(":checked", "change", function () {
            $pdf.attr("href", exportUrl + "/" + $(this).val());
            var index = $(this).parents("li:first").index();
            $(".tabber-selectors").find("li a.active").removeClass("active");
            $(".tabber-selectors").find("li:eq(" + index + ") a").addClass("active");
            $(".tabber-contents").find("div.tabber-content").removeClass("active");
            $(".tabber-contents").find("div.tabber-content:eq(" + index + ")").addClass("active");
        });
    }

    return {
        init: init
    };
})();

var Filter = (function () {
    var ajaxAction = false;
    var $productList = $("#product-list"), $compareList = $("#compare-list"), $filterList = $(".filter-list");

    function init() {
        $filterList.delegate(".filter-btn input", "change", function () {
            var index = $(this).parents("li:first").index();

            $filterList.find("div.filter-block").hide();
            $filterList.find('div.filter-block ul input:eq(0)').prop('checked', true);
            $filterList.find("div.filter-block:eq(" + index + ")").show();

            refresh_compare_list('', '', "clear").done(function () {
                return get_product_list();
            });
        }).delegate(".filter-block input", "click", get_product_list);

        $productList.delegate(":checkbox", "click", function () {
            // 是否在更新比較的產品清單動作
            if (ajaxAction) return false;

            var action = $(this).prop("checked") ? "add" : "delete";
            if (action == "add" && $compareList.children("li").length >= 5) return false;

            $(this).parents(".item:first").toggleClass('active');
            return refresh_compare_list($(this).val(), $(this).data('mid'), action);
        });

        $compareList.delegate("div.close-icon a", "click", function () {
            refresh_compare_list($(this).data('pid'), $(this).data('mid'), "delete").done(function () {
                return get_product_list();
            });
        });

        $("#reset-filter").click(function () {
            document.getElementById("filter-form").reset();
            return get_product_list();
        });

        $("#clear-btn").click(function () {
            refresh_compare_list('', '', "clear").done(function () {
                return get_product_list();
            });
        });

        return get_product_list();
    }

    function get_product_list() {
        return $.ajax({
            url: website.site_url('ajax/filter/get_product_list'),
            type: 'GET',
            data: $("#filter-form").serializeArray(),
            dataType: 'JSON',
            success: function (response) {
                $productList.html(response['list']);
            }
        });
    }

    function refresh_compare_list(pId, mId, action) {
        //Control Refresh Tooltips
        $('.refreshing').fadeIn();

        return $.ajax({
            url: website.site_url('ajax/filter/get_compare_list'),
            type: 'POST',
            data: { pId: pId, mId: mId, action: action },
            dataType: 'JSON',
            beforeSend: function () {
                ajaxAction = true;
            },
            complete: function () {
                ajaxAction = false;
            },
            success: function (response) {
                $compareList.html(response['list']);
                $('.refreshing').fadeOut();
                $('#sticker').sticky('update');
            }
        });
    }

    return {
        init: init
    };
})();

var article = (function () {
    var $cId = $("select.news-select"), $year = $("select.year-select");

    function init() {
        $cId.change(function () {
            location.href = website.site_url('news/category/' + $(this).val());
        });

        $year.change(function () {
            get_article_list($cId.val(), $(this).val());
        });

        $("#search-news-btn").click(function () {
            if ($("input.search-news").val() != "") {
                $("#search-news").submit();
            }
        });

        get_article_list($cId.val(), $year.val());
        return true;
    }

    function get_article_list(cId, year) {
        return $.ajax({
            url: website.site_url('ajax/news/get_article_list'),
            type: 'GET',
            data: { cId: cId, year: year },
            dataType: 'JSON',
            success: function (response) {
                $("div.news-content ul").html(response['list']);
            }
        });
    }

    return {
        init: init
    };
})();

var support = (function () {
    function videoInit() {
        $("select.news-select").change(function () {
            var type = $(this).children("option:selected").data('tag');
            location.href = website.site_url('support/video/type/' + (type != "" ? type : $(this).val()));
        });

        return true;
    }

    var fileInit = function () {
        var page = 1;
        var $mainId = $("select#mainId"), $minorId = $("select#minorId"), $fileList = $("#file-list");

        $mainId.change(function () {
            var type = $(this).children("option:selected").data('tag');
            location.href = website.site_url('support/file/type/' + (type != "" ? type : $(this).val()));
        });

        $minorId.change(function () {
            get_file_list(1);
        }).trigger('change');

        $("#search-btn").click(function () {
            get_file_list(1);
        });

        $fileList.delegate("div.page-wrap a", "click", function () {
            get_file_list($(this).data('page'));
        });

        function get_file_list(currentPage) {
            page = currentPage != undefined ? currentPage : 1;
            return $.ajax({
                url: website.site_url('ajax/support/get_file_list'),
                type: 'GET',
                data: { mainId: $mainId.val(), minorId: $minorId.val(), search: $("#search").val(), page: page },
                dataType: 'JSON',
                success: function (response) {
                    $fileList.html(response['list']);
                }
            });
        }
    };

    return {
        videoInit: videoInit,
        fileInit: fileInit
    };
})();

var Storage = (function () {
    var modelList = false, resolutionList = false;
    var $modelList = $("#model-list"), $resolutionList = $("#resolution-list");
    var $format = $(":radio.format"), $quality, $fps = $("#fps"), $bandwidth = $("#calc-1");
    var $hours = $("#hours"), $days = $("#days"), $amount = $("#amount"), $storage = $("#calc-2");
    var $projectPopup = $("#project-popup"), $summaryPopup = $("#summary-popup");

    function init() {
        get_calc_data().done(function (response) {
            modelList = response['modelList'];
            resolutionList = response['resolutionList'];
            $(":radio.format:checked").trigger("change");
            $modelList.trigger("change");
        });

        $modelList.change(function () {
            $resolutionList.html($resolutionList.find("option:first").clone());

            var modelId = $(this).val(), rId;
            if (modelList[modelId] != undefined) {
                for (var i in modelList[modelId]) {
                    rId = modelList[modelId][i];
                    $resolutionList.append('<option value="' + rId + '">' + resolutionList[rId]['name'] + '</option>');
                }
            }

            $resolutionList.trigger("change");
        });

        $format.change(function () {
            var format = $(this).val();
            $.ajax({
                url: website.site_url('ajax/tool/storage/get_product_data'),
                type: 'post',
                data: { format: format },
                dataType: 'json',
                success: function (response) {
                    $('#model-list').html('');
                    $('#model-list').append('<option value="0">' + $('#model-list').data('first') + '</option>');
                    $.each(response['modelList'], function (key, value) {
                        $('#model-list').append('<option value=' + value.modelId + '>' + value.name + '</option>');
                    });
                }
            });
            $quality = $("#quality-1");
            $quality.find('option:first').prop("selected", true).trigger("change");
        });

        $format.change(function () {
            var format = $(this).val();
            $.ajax({
                url: website.site_url('ajax/tool/storage/get_quality_data'),
                type: 'post',
                data: { format: format },
                dataType: 'json',
                success: function (response) {
                    $('#quality-1').html('');
                    $('#quality-1').append('<option value="0">' + $('#quality-1').data('first') + '</option>');
                    $.each(response['qualityList'], function (key, value) {
                        $('#quality-1').append('<option value=' + value.actual_265 + '>' + value.name + '</option>');
                    });
                }
            });
            $quality = $("#quality-1");
            $quality.find('option:first').prop("selected", true).trigger("change");
        });

        $resolutionList.change(function () {
            $fps.html($fps.find("option:first").clone());

            var rId = $(this).val(), fps;
            if (resolutionList[rId] != undefined) {
                var fpsGroup = resolutionList[rId]['fpsGroup'];
                for (fps in fpsGroup) {
                    $fps.append('<option value="' + fpsGroup[fps] + '">' + fps + '</option>');
                }
            }

            $fps.trigger("change");
        });

        $("#quality-1").change(calc2);
        $("#quality-2").blur(function () {
            var quality = parseInt($(this).val());
            if (quality < 1 || isNaN(quality)) quality = 1;
            if (quality > 100) quality = 100;
            $quality.val(quality);
            return calc2();
        });
        $fps.change(calc2);
        $hours.change(calc2);
        $days.blur(function () {
            var day = parseInt($(this).val());
            if (day < 1 || isNaN(day)) day = 1;
            $days.val(day);
            return calc2();
        });
        $amount.blur(function () {
            var amount = parseInt($(this).val());
            if (amount < 1 || isNaN(amount)) amount = 1;
            $amount.val(amount);
            return calc2();
        });

        $projectPopup.magnificPopup({
            type: 'ajax',
            overflowY: 'scroll',
            callbacks: {
                open: function () {
                    document.getElementById("storage-form").reset();
                    $modelList.trigger("change");
                },
                ajaxContentAdded: function () {
                    // Ajax content is loaded and appended to DOM
                    var $content = $(this.content);
                    $content.find("a.delete-btn").click(function () {
                        $(this).parents("tr:first").remove();

                        var total = Total();
                        $content.find("#bandwidth").text(total['bandwidth']);
                        $content.find("#storage").text(total['storage']);
                        $content.find("input[name='bandwidth']").val(total['bandwidth']);
                        $content.find("input[name='storage']").val(total['storage']);

                        if (total['bandwidth'] == 0) {
                            $content.find('#project-form').submit();
                        }
                    });

                    function Total() {
                        var bandwidth = 0, storage = 0;
                        var $total = $content.find("td.total");

                        if ($total.length > 0) {
                            $total.each(function (index, element) {
                                bandwidth += parseFloat($(element).children(".bandwidth").val());
                                storage += parseFloat($(element).children(".storage").val());
                            });
                        }

                        return { bandwidth: bandwidth.toFixed(2), storage: storage.toFixed(2) };
                    }
                }
            }
        });

        $summaryPopup.magnificPopup({
            type: 'ajax',
            overflowY: 'scroll',
            callbacks: {
                ajaxContentAdded: function () {
                    // Ajax content is loaded and appended to DOM
                    var $content = $(this.content);
                    $content.find("#send-btn").click(function () {
                        var $form = $content.find("#business-form");

                        return $.ajax({
                            url: $form.attr("action"),
                            type: "POST",
                            data: $form.serializeArray(),
                            dataType: 'JSON',
                            success: function (response) {
                                alert(response["message"]);
                                if (response['status']) {
                                    location.reload();
                                }
                            }
                        });
                    });
                }
            }
        });

        $("#action-btn").delegate("a#add-btn", "click", function () {
            var href = $(this).data("href");
            var total = calc2();
            if (total != 0) href += "?" + set_param();
            $projectPopup.attr("href", href).magnificPopup('open');
        });
    }

    function calc1() {
        var format = $(":radio.format:checked").val();
        var quality = parseFloat($quality.val());
        var fps = parseFloat($fps.val());
        var amount = parseFloat($amount.val());
        var total = quality * fps * amount;
        $bandwidth.text(total.toFixed(2));
        return total;
    }

    function calc2() {
        var hours = parseInt($hours.val());
        var days = parseInt($days.val());
        var total = calc1() / 8 * 60 * 60 * hours * days / 1024 / 1024;

        $storage.text(total.toFixed(2));
        return total;
    }

    function set_param() {
        var format = $(":radio.format:checked").val();
        return $.param({
            model: $modelList.children("option:selected").text(),
            resolution: $resolutionList.children("option:selected").text(),
            format: format == 1 ? "H.264" : "H.265",
            quality: $quality.children("option:selected").text(),
            fps: $fps.children("option:selected").text(),
            hours: $hours.val(),
            days: $days.val(),
            amount: $amount.val(),
            bandwidth: $bandwidth.text(),
            storage: $storage.text()
        });
    }

    function get_calc_data() {
        return $.ajax({
            url: website.site_url('ajax/tool/storage/get_calc_data'),
            type: 'GET',
            dataType: 'JSON'
        });
    }

    return {
        init: init
    };
})();

var primaryBitrate = 0, secondaryBitrate = 0, maxFrameRate = 0, totalThrough = 0, totalSecond, minSize, maxSize, minSize, maxSize;

var AHD = (function () {
    var typeList = false, resolutionList = false;
    var $typeList = $("#type-list"), $channelChange = $(".channelChange");
    var $day = $("#day"), $hour = $("#hour"), $quality = $("#quality"), $channel = $("#channel"), $hours = $("#hours"), $days = $("#days"), $estimate = $('#estimate');

    function init() {
        get_calc_data().done(function (response) {
            typeList = response['typeList'];
            // resolutionList = response['resolutionList'];
            $typeList.trigger("change");
        });

        $typeList.change(function () {
            // $resolutionList.html($resolutionList.find("option:first").clone());

            var typeId = $(this).val(), rId;
            // if (typeList[typeId] != undefined) {
            //     for (var i in typeList[typeId]) {
            //         rId = typeList[typeId][i];
            //         $resolutionList.append('<option value="' + rId + '">' + resolutionList[rId]['name'] + '</option>');
            //     }
            // }


            // $resolutionList.trigger("change");
        });

        $channelChange.change(function () {
            // $day.html($day.find("option:first").clone());
            // $hour.html($hour.find("option:first").clone());
            var channelList = { 1: '2a_channel', 2: '3a_channel' };
            var channel = $typeList.val();
            var channel_item = {};
            $(".channel_group").remove();
            for (var i = 1; i <= $('#channelList').val(); i++) {
                channel_item[i] = $($('#' + channelList[channel]).html());
                $(channel_item[i]).find('h4:eq(0)').append(i).css('color', 'red');

                $.each(channel_item[i].find('select'), function (key, value) {
                    switch ($(this).attr('class')) {
                        case 'share-select resolution':
                            $(this).attr('id', 'resolution_' + i);
                            break;
                        case 'share-select primary_quality':
                            $(this).attr('id', 'primary_quality_' + i);
                            break;
                        case 'share-select secondary_quality':
                            $(this).attr('id', 'secondary_quality_' + i);
                            break;
                        case 'share-select recored_format_rate':
                            $(this).attr('id', 'recored_format_rate_' + i);
                    }
                });

                channel_item[i].find('.check').attr('data-id', i);
                channel_item[i].find('button').attr('onclick', 'AHD.change_value(' + i + ')');
                $('#compute-form').append(channel_item[i]);
            }
            // var rId = $(this).val();
            // var resolution = resolutionList[rId];
            // if (resolution != undefined) {
            //     var day = resolution['day'], fpsMin = resolution['fpsMin'], fpsMax = resolution['fpsMax'];

            //     $bitRate.append('<option value="' + bitRate + '">' + bitRate + '</option>');
            //     for (var hour = fpsMin; fps <= fpsMax; fps++) {
            //         $fps.append('<option value="' + fps + '">' + fps + '</option>');
            //     }
            // }

            // return calc();
        });

        $estimate.click(function () {
            primaryBitrate = 0, secondaryBitrate = 0, maxFrameRate = 0, totalThrough = 0, totalSecond = 0, minSize = 0, maxSize = 0, minSize = 0, maxSize = 0;
            $.each($('.check'), function (key, value) {
                if ($(value).prop('checked')) {
                    var id = $(value).data('id');
                    var resolution = $('#resolution_' + id).val();
                    var primary_quality = parseInt($('#primary_quality_' + id).val());
                    var secondary_quality = parseInt($('#secondary_quality_' + id).val());
                    var video_format = $('#video_format').val();
                    var recored_format_rate = $('#recored_format_rate_' + id).val();
                    var recored_day = $('#day').val();
                    var recored_hour = $('#hour').val();

                    if ($('#type-list').val() == 1) {
                        switch (resolution) {
                            case '0':
                                primaryBitrate = 6144 * 1024 / 8;
                                secondaryBitrate = 1024 * 1024 / 8;
                                break;
                            case '1':
                                primaryBitrate = 4096 * 1024 / 8;
                                secondaryBitrate = 1024 * 1024 / 8;
                                break;
                            case '2':
                                primaryBitrate = 2560 * 1024 / 8;
                                secondaryBitrate = 512 * 1024 / 8;
                                break;
                        }
                    } else {
                        primaryBitrate = covertSelToBitrate(primary_quality);
                        secondaryBitrate = covertSelToBitrate(secondary_quality);
                    }

                    if (video_format == 0) {
                        maxFrameRate = 30;
                    } else {
                        maxFrameRate = 25;
                    }

                    if (recored_format_rate > maxFrameRate) {
                        recored_format_rate = maxFrameRate;
                    }

                    if ($('#type-list').val() == 1) {
                        totalThrough += parseFloat((primaryBitrate * (0.4 + 0.6 * (recored_format_rate / maxFrameRate))) * (primary_quality / 100));
                        totalThrough += parseFloat((secondaryBitrate * (0.4 + 0.6 * (recored_format_rate / maxFrameRate))) * (secondary_quality / 100));
                    } else {
                        totalThrough += parseFloat((primaryBitrate * (0.4 + 0.6 * (recored_format_rate / maxFrameRate))));
                        totalThrough += parseFloat((secondaryBitrate * (0.4 + 0.6 * (recored_format_rate / maxFrameRate))));
                    }

                    totalSecond = 3600 * recored_hour * recored_day;

                    minSize = totalSecond * totalThrough;
                    maxSize = minSize / 0.75;
                    maxSize /= 0.85;

                    var GB = "GB";
                    var maxUsedGB = 0;

                    maxUsedGB = maxSize / 1000000000;

                    var humanString = "";
                    humanString += (maxUsedGB >= 1) ? (maxUsedGB.toFixed(2) + "GB ") : "";
                    $('#result').html(humanString);
                }
            });

            function covertSelToBitrate(index) {
                var ret = 0.0;
                switch (index) {
                    case 1:
                        ret = 128 * 1024 / 8;//to byte/
                        break;
                    case 2:
                        ret = 256 * 1024 / 8;//to byte/
                        break;
                    case 3:
                        ret = 512 * 1024 / 8;//to byte/
                        break;
                    case 4:
                        ret = 1024 * 1024 / 8;//to byte/
                        break;
                    case 5:
                        ret = 2048 * 1024 / 8;//to byte/
                        break;
                    case 6:
                        ret = 3072 * 1024 / 8;//to byte/
                        break;
                    case 7:
                        ret = 4096 * 1024 / 8;//to byte/
                        break;
                    case 8:
                        ret = 5120 * 1024 / 8;//to byte/
                        break;
                    case 9:
                        ret = 6144 * 1024 / 8;//to byte/
                        break;
                    case 10:
                        ret = 7168 * 1024 / 8;//to byte/
                        break;

                }
                return ret;
            }
        })

        $quality.blur(function () {
            var quality = $(this).val();
            if (quality < 1 || isNaN(quality)) quality = 1;
            if (quality > 100) quality = 100;
            $quality.val(quality);
            return calc();
        });

        $channel.change(calc);
        $hours.change(calc);
        $days.change(calc);

    }

    function change_value(id) {
        var resolution = $('#resolution_' + id).val();
        var primary_quality = $('#primary_quality_' + id).val();
        var secondary_quality = $('#secondary_quality_' + id).val();
        var recored_format_rate = $('#recored_format_rate_' + id).val();
        $.each($('.channel_group'), function () {
            $(this).find('.resolution').val(resolution);
            $(this).find('.primary_quality').val(primary_quality);
            $(this).find('.secondary_quality').val(secondary_quality);
            $(this).find('.recored_format_rate').val(recored_format_rate);
        });
        return true;
    }

    function calc() {
        var FPSs = parseInt($fps.val());
        var Qty = parseFloat($quality.val()) / 100;
        var Bitr = parseInt($bitRate.val());
        var Days = parseInt($days.val());
        var Chs = parseInt($channel.val());
        var RecHR = parseInt($hours.val());

        //var result = Qty * Bitr * (0.4 + 0.6 * FPSs / 25) * 1024 / 8 * 60 * RecHR * 60 * Days * 1.5;
        var result = Qty * Bitr * (0.4 + 0.6 * FPSs / 25) / 8 * RecHR * Days * Chs * 60 * 60 / 1024 * 1.5;
        //var result = Qty * Bitr * (0.4 + 0.6 * FPSs / 25) * 1024 / 8 * 60 * RecHR * 60 * Days;

        $("#result").text(Math.round(result * 1000) / 1000);
        return true;
    }

    function get_calc_data() {
        return $.ajax({
            url: website.site_url('ajax/tool/ahd/get_calc_data'),
            type: 'GET',
            dataType: 'JSON'
        });
    }


    return {
        init: init,
        change_value: change_value
    };
})();

var Camera = (function () {
    var unitsList = [3.2808399, 0.3048], modelList = false;
    var $width, $distance, $height;
    var $modelList = $("#model-list"), $length = $("#length"), $units = $("#units"), $feet = $("#feet"), $meter = $("#meter");

    function init() {
        if ($(".compute-block").is(":visible")) {
            $width = $(".compute-block #width").change(calc);
            $distance = $(".compute-block #distance").change(calc);
            $height = $(".compute-block #height").change(calc);
        } else {
            $width = $(".compute-block-phone #width").change(calc);
            $distance = $(".compute-block-phone #distance").change(calc);
            $height = $(".compute-block-phone #height").change(calc);
        }

        get_calc_data().done(function (response) {
            modelList = response['modelList'];
        });

        $modelList.change(calc);

        $units.change(function () {
            return change_units($units.val());
        });

        $length.change(function () {
            var camera_to_target, width;
            var length = parseFloat($length.val());
            var distance = parseFloat($distance.val());
            var height = parseFloat($height.val());
            var model = parseFloat($modelList.val());

            if (modelList[model] == undefined) return false;

            camera_to_target = Math.pow(Math.pow(distance, 2) + Math.pow(height, 2), 0.5);
            width = modelList[model]['size'] * camera_to_target / length;
            $width.val(width.toFixed(1));
            return calc();
        });

        $("#reset").click(function () {
            document.getElementById("compute-form").reset();
            return calc();
        });
    }

    function change_units(units) {
        $width.val((parseFloat($width.val()) * unitsList[units]).toFixed(0));
        $distance.val((parseFloat($distance.val()) * unitsList[units]).toFixed(0));
        $height.val((parseFloat($height.val()) * unitsList[units]).toFixed(0));
        return calc();
    }

    function calc() {
        var camera_to_target, length, result, feet, meter;
        var width = $width.val();
        var distance = $distance.val();
        var height = $height.val();
        var model = $modelList.val();

        // 如果找不到型號，都設為0
        if (modelList[model] == undefined) return set_value(0, 0, 0);
        // 如果距離、寬、高其中有空值，都設為0
        if (distance == '' || width == '' || height == '') return set_value(0, 0, 0);

        // 取得攝影機到目標的距離
        camera_to_target = Math.pow(Math.pow(distance, 2) + Math.pow(height, 2), 0.5);
        length = modelList[model]['size'] * camera_to_target / width;
        $length.val(length.toFixed(1));

        result = modelList[model]['pixel'] / width;
        if ($units.val() == 0) {
            feet = result;
            meter = result.toFixed(0) * unitsList[$units.val()];
        } else {
            meter = result;
            feet = result.toFixed(0) * unitsList[$units.val()];
        }

        var angle = 2 * Math.atan(modelList[model]['size'] / (2 * length)) * 57.3;

        if (width == 0 || distance == 0 || isNaN(angle)) return set_value(0, 0, 0);

        return set_value(length, feet, meter);
    }

    function set_value(length, feet, meter) {
        $length.val(length.toFixed(1));
        $feet.text(feet.toFixed(0));
        $meter.text(meter.toFixed(0));
        return change_image(feet.toFixed(0));
    }

    function change_image(feet) {
        var index = null;
        if (feet >= 90) index = 0;
        if (feet >= 60 && feet < 90) index = 1;
        if (feet >= 45 && feet < 60) index = 2;
        if (feet >= 35 && feet < 45) index = 3;
        if (feet >= 25 && feet < 35) index = 4;
        if (feet >= 10 && feet < 25) index = 5;
        $("#reference-image p").text(index != null ? $("#example-image li:eq(" + index + ") h4").text() : "");
        $("#reference-image div.pic").html(index != null ? $("#example-image li:eq(" + index + ") img").clone() : "");
    }

    function get_calc_data() {
        return $.ajax({
            url: website.site_url('ajax/tool/camera/get_calc_data'),
            type: 'GET',
            dataType: 'JSON'
        });
    }

    return {
        init: init
    };
})();

var RAID = (function () {
    var mobile = $(".hard-drive-phone").is(":visible");
    var levelList = false, modelList = false, hddList = false;
    var $modelList = $("#model-list"), $levelList = $("#level-list"), $amount = $("#amount"), $hddList, $driveList = $("#drive-list"), $total = $("#total"), $tolerant = $("#tolerant");

    function init() {
        $hddList = mobile ? $("select#hdd-list") : $("ul#hdd-list");

        $modelList.change(function () {
            $levelList.find("select").html($levelList.find("option:first").clone());

            var model = $(this).val(), amount = 0;
            if (modelList[model] != undefined) {
                var option = '', level;

                for (var index in modelList[model]['level']) {
                    level = modelList[model]['level'][index];
                    option += '<option value="' + level + '">' + levelList[level]['name'] + '</option>';
                }
                $levelList.find("select").append(option);
                amount = modelList[model]['amount'];
            }

            if (amount == "2") {
                $levelList.find("select:eq(1)").slideDown();
                $amount.find("select:eq(1)").slideDown();
            } else {
                $levelList.find("select:eq(1)").slideUp();
                $amount.find("select:eq(1)").slideUp();
            }

            $levelList.find("select:first").trigger("change");
        });

        $levelList.delegate('select', 'change', function () {
            $amount.find("select").html($amount.find("option:first").clone());

            var level1 = $levelList.find("select:eq(0)").val(), level2 = $levelList.find("select:eq(1)").val();
            if (level1 != "0" || level2 != "0") {
                var model = $modelList.val();
                var max = modelList[model]['max'];

                var i, k, plus;
                if (level1 != "0" && level2 != "0") {
                    plus = { 1: [2, 1], 2: [2, 2], 3: [3, 0], 4: [3, 1] };
                    for (i = plus[level1][0], k = plus[level2][0]; i + k <= max; i += plus[level1][1], k += plus[level2][1]) {
                        $amount.find("select").append('<option value="' + (i + k) + '">' + (i + k) + '</option>');
                        if (level1 == "3" && level2 == "3") break;
                    }
                } else {
                    var index = level1 != "0" ? "0" : "1";
                    var level = level1 != "0" ? level1 : level2;

                    plus = { 1: [2, 1], 2: [2, 2], 3: [3, 1], 4: [3, 1], 5: [4, 1], 6: [4, 2], 7: [6, 2], 8: [6, 2] };
                    for (i = plus[level][0]; i <= max; i += plus[level][1]) {
                        $amount.find("select:eq(" + index + ")").append('<option value="' + i + '">' + i + '</option>');
                    }
                }
            }

            $amount.find("select:first").trigger("change");
        });

        $amount.delegate('select', 'change', function () {
            var amount = parseInt($amount.find("select:eq(0)").val()) + parseInt($amount.find("select:eq(1)").val());
            $hddList.children("li.active").removeClass("active");
            $driveList.removeClass("active").html("");
            for (var i = 1; i <= amount; i++) {
                $driveList.append("<li><h4></h4></li>");
            }
            $total.text("0TB");
        });

        $("#reset").click(function () {
            $modelList.find('option:first').prop("selected", true);
            $modelList.trigger("change");
            $tolerant.text("");
        });

        if (mobile) {
            $hddList.change(calc);
        } else {
            $hddList.on("click", "li", calc);
        }

        get_calc_data().done(function (response) {
            modelList = response['modelList'];
            levelList = response['levelList'];
            hddList = response['hddList'];
        });
    }

    function calc() {
        var hdd = mobile ? $hddList.val() : $hddList.children("li.active").data('id');

        if (hddList[hdd] != undefined) {
            var amount, tolerant;
            var level1 = $levelList.find("select:eq(0)").val(), level2 = $levelList.find("select:eq(1)").val();

            if (level1 != "0" || level2 != "0") {
                amount = parseInt($amount.find("select:eq(0)").val()) + parseInt($amount.find("select:eq(1)").val());
                var count, fault = { 1: 0, 2: 1, 3: 1, 4: 1, 5: 2, 6: (1 + 1), 7: (1 + 1), 8: (2 + 2) };

                if (level1 != "0" && level2 != "0") {
                    var type = { "1-1": 2, "1-2": 5, "1-3": 6, "1-4": 3, "2-2": 1, "2-3": 1, "2-4": 6, "3-3": 1, "3-4": 7, "4-4": 2 };
                    count = { 1: 2, 2: amount, 3: (amount - 1), 4: (amount - 2), 5: (amount - 2 + 1), 6: (amount - 3 + 1), 7: (amount - 4 + 1) };
                    amount = count[type[level1 > level2 ? level2 + '-' + level1 : level1 + '-' + level2]];
                    tolerant = (hddList[hdd]['actual'] * parseInt(fault[level1]) / 1024).toFixed(2) + "TB, ";
                    tolerant += (hddList[hdd]['actual'] * parseInt(fault[level2]) / 1024).toFixed(2) + "TB";
                } else {
                    var level = level1 != "0" ? level1 : level2;
                    count = { 1: amount, 2: 1, 3: 1, 4: (amount - 1), 5: (amount - 1), 6: (amount / 2), 7: (amount - 2), 8: (amount - 4) };
                    amount = count[level];
                    tolerant = (hddList[hdd]['actual'] * parseInt(fault[level]) / 1024).toFixed(2) + "TB";
                }
            }

            $total.text((hddList[hdd]['actual'] * parseInt(amount) / 1024).toFixed(2) + "TB");
            $tolerant.text(tolerant);
        }
        return true;
    }

    function get_calc_data() {
        return $.ajax({
            url: website.site_url('ajax/tool/raid/get_calc_data'),
            type: 'GET',
            dataType: 'JSON'
        });
    }

    return {
        init: init
    };
})();

var Worldwide = function () {
    var $areaSelect1 = $('#select-area1'), $areaSelect2 = $('#select-area2'), $typeSelect = $('#select-type'), $locationList = $('#list-location');

    $areaSelect2.change(get_location_list);

    $typeSelect.change(function (response) {
        $areaSelect2.html($areaSelect2.find('option:eq(0)').clone());

        get_location_list().done(function (response) {
            if (response['status']) {
                $areaSelect2.append(response['areaOption']);
            } else {
                alert(response['message']);
            }
        });
    });

    $areaSelect1.change(function () {
        $typeSelect.html($typeSelect.find('option:eq(0)').clone());
        $areaSelect2.html($areaSelect2.find('option:eq(0)').clone());

        get_location_list().done(function (response) {
            if (response['status']) {
                $typeSelect.append(response['typeOption']);
                $areaSelect2.append(response['areaOption']);
            } else {
                alert(response['message']);
            }
        });
    }).trigger('change');

    function get_location_list() {
        return $.ajax({
            url: website.site_url('ajax/worldwide/get_location_list'),
            type: 'GET',
            data: { mainId: $areaSelect1.val(), minorId: $areaSelect2.val(), type: $typeSelect.val() },
            dataType: 'JSON',
            success: function (response) {
                $locationList.html(response['list']);
            }
        });
    }
};

var Search = (function () {
    var search;
    var $searchType = $("#search-type");

    function init() {
        search = $("#search").val();
        $searchType.delegate("li:not(.active)", "click", function () {
            $(this).addClass('active').siblings('li.active').removeClass('active');
            return get_search_list();
        });

        $("#search-list").delegate("select.download-select", "change", function () {
            var filePath = $(this).data('path');
            var lang = $(this).val();

            if (lang) {
                window.open(website.base_url("assets/uploads/support/file/" + filePath.replace(/lang/, lang.toUpperCase())));
                return true;
            }
            return false;
        });

        return get_search_list();
    }

    function get_search_list() {
        return $.ajax({
            url: website.site_url('homepage/get_search_list'),
            type: 'GET',
            data: { type: $searchType.find("li.active").data('type'), search: search },
            dataType: 'JSON',
            success: function (response) {
                $("#search-list").html(response['list']);
            }
        });
    }

    return {
        init: init
    };
})();
