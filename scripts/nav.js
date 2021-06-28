    function toggleNav() {
      var nav = document.getElementById("mySidebar"),
       main = document.getElementById("main");
      if (nav.style.width == "250px") {
        nav.style.width = "0";
        main.style.marginRight = "0";
      }
      else {
        nav.style.width = "250px";
        main.style.marginRight = "0px";
      }
    }
    
    function closeNav() {
        document.getElementById("nav").style.width = "0";
        document.getElementById("main").style.marginRight = "0";
    }

    
    /* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;

    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }