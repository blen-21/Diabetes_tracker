const links = document.querySelectorAll('nav ul li a');
links.forEach(link => {
    link.addEventListener('mouseover', () => {
      link.style.fontWeight = 'bold';
      link.style.fontSize = '1.1em';
      link.style.color = "#FFBA00";
    });
    link.addEventListener('mouseout', () => {
      link.style.fontWeight = 'normal';
      link.style.fontSize = '1em';
      link.style.color = "white";
    });
  });
  
  /* for the menu */

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('menu-button').addEventListener('click', function() {
        var menu = document.getElementById('menu');
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'block';
        }
    });
});

