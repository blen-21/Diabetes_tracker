/*for the edit profile */
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-button');
    const editForm = document.getElementById('edit-form');
    const cancelButton = document.getElementById('cancel-edit');
  
    // Show edit form
    editButton.addEventListener('click', () => {
        editForm.style.display = 'block';
        editButton.style.display = 'none';
    });
  
    // Hide edit form
    cancelButton.addEventListener('click', () => {
        editForm.style.display = 'none';
        editButton.style.display = 'block';
    });
  });
 // 
  function toggleDropdown() {
    const dropdown = document.getElementById("notificationDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Optional: Close the dropdown when clicking outside of it
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("notificationDropdown");
    const notificationIcon = document.querySelector(".notification-icon");

    if (!notificationIcon.contains(event.target)) {
        dropdown.style.display = "none";
    }
});
