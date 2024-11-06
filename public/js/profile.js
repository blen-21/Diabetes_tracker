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
  