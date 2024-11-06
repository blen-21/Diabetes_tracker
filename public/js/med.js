document.addEventListener('DOMContentLoaded', () => {
    const addReminderButton = document.getElementById('add-reminder');
    const remindersContainer = document.getElementById('reminders-container');
    let reminderCount = 1; // Start with 1 because we already have one reminder by default

    addReminderButton.addEventListener('click', () => {
        const newReminder = document.createElement('div');
        newReminder.classList.add('form-group', 'reminder-item');

        newReminder.innerHTML = `
            <label for="medication-name-${reminderCount}">Medication Name:</label>
            <input type="text" id="medication-name-${reminderCount}" name="medication-name[]" required>
            
            <label for="reminder-time-${reminderCount}">Reminder Time:</label>
            <input type="time" id="reminder-time-${reminderCount}" name="reminder-time[]" required>
            
            <label for="reminder-frequency-${reminderCount}">Frequency:</label>
            <select id="reminder-frequency-${reminderCount}" name="reminder-frequency[]">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
            </select>
        `;

        remindersContainer.appendChild(newReminder);
        reminderCount++;
    });
});
