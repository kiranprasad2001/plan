// ===================================================================
// IMPORTS
// ===================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Import the configuration from its own file
import { firebaseConfig } from './firebase-config.js';

// Import all the monthly data plans
import julyPlan from './data/2025/july.js';
import augustPlan from './data/2025/august.js';
import septemberPlan from './data/2025/september.js';
import octoberPlan from './data/2025/october.js';
import novemberPlan from './data/2025/november.js';
import decemberPlan from './data/2025/december.js';
import januaryPlan from './data/2026/january.js';
import februaryPlan from './data/2026/february.js';
import marchPlan from './data/2026/march.js';
import aprilPlan from './data/2026/april.js';
import mayPlan from './data/2026/may.js';
import junePlan from './data/2026/june.js';

// ===================================================================
// CONFIGURATION & STATE
// ===================================================================
const learningPlan = {
    2025: { 'July': julyPlan, 'August': augustPlan, 'September': septemberPlan, 'October': octoberPlan, 'November': novemberPlan, 'December': decemberPlan },
    2026: { 'January': januaryPlan, 'February': februaryPlan, 'March': marchPlan, 'April': aprilPlan, 'May': mayPlan, 'June': junePlan }
};

let app, auth, db, userId;
let activityStatusUnsubscribe, customTasksUnsubscribe, rewardsUnsubscribe;
let currentDisplayDate = new Date();
let activityStatus = {};
let customTasks = {};
let starCount = 0;
let activeCalendarActivity = null; // To store the activity for the calendar modal

// ===================================================================
// DOM ELEMENT SELECTORS
// ===================================================================
const loadingOverlay = document.getElementById('loading-overlay');
const mainView = document.getElementById('main-view');
const rewardsView = document.getElementById('rewards-view');
const calendarView = document.getElementById('calendar-view');
const currentMonthEl = document.getElementById('current-month');
const currentDateEl = document.getElementById('current-date');
const activitiesContainer = document.getElementById('activities-container');
const incompleteContainer = document.getElementById('incomplete-activities-container');
const incompleteList = document.getElementById('incomplete-activities-list');
const starCountBadge = document.getElementById('star-count-badge');
const totalStarsDisplay = document.getElementById('total-stars-display');
const starGrid = document.getElementById('star-grid');
const calendarMonthYearEl = document.getElementById('calendar-month-year');
const calendarGrid = document.getElementById('calendar-grid');
const calendarActivityView = document.getElementById('calendar-activity-view');
const calendarActivityDate = document.getElementById('calendar-activity-date');
const calendarActivityList = document.getElementById('calendar-activity-list');
const monthlyPlanLinksContainer = document.getElementById('monthly-plan-links');

// Buttons
const menuButton = document.getElementById('menu-button');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const rewardsButton = document.getElementById('rewards-button');
const addCustomTaskButton = document.getElementById('add-custom-task-button');
const backToHomeButton = document.getElementById('back-to-home-button');
const rewardsBackButton = document.getElementById('rewards-back-button');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

// Modals
const activityModal = document.getElementById('activity-modal');
const customTaskModal = document.getElementById('custom-task-modal');
const modalCloseButton = document.getElementById('modal-close-button');
const customTaskCancelButton = document.getElementById('custom-task-cancel-button');
const customTaskAddButton = document.getElementById('custom-task-add-button');

// Calendar Activity View
const calendarModal = document.getElementById('calendar-modal');
const googleCalButton = document.getElementById('google-cal-button');
const appleCalButton = document.getElementById('apple-cal-button');
const calendarModalCloseButton = document.getElementById('calendar-modal-close-button');

// ===================================================================
// CORE FUNCTIONS
// ===================================================================
function formatDateKey(date) { return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; }

function getActivitiesForDate(date) {
    const year = date.getFullYear();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const dayName = date.toLocaleString('default', { weekday: 'long' });
    if (dayName === 'Saturday' || dayName === 'Sunday' || !learningPlan[year] || !learningPlan[year][monthName]) return [];
    const monthPlan = learningPlan[year][monthName];
    const dayOfMonth = date.getDate();
    const weekNumber = Math.ceil(dayOfMonth / 7);
    const dayEntry = monthPlan.find(entry => entry.week === weekNumber && entry.day === dayName);
    return dayEntry ? dayEntry.activities : [];
}

function getCategoryColor(category) {
    const colors = {
        'Math': '#3b82f6', 'Math Game': '#3b82f6', 'French': '#ef4444', 'Language Fun': '#f97316', 'Mandarin': '#10b981',
        'Creative': '#8b5cf6', 'Free Play': '#8b5cf6', 'Literacy': '#f59e0b', 'Social': '#ec4899', 'Fine Motor': '#6366f1',
        'Gross Motor': '#14b8a6', 'Science': '#06b6d4', 'Self-Help': '#22c55e', 'Custom': '#64748b'
    };
    return colors[category] || '#6b7280';
}

// ===================================================================
// UI & RENDERING FUNCTIONS
// ===================================================================
function renderMainView() {
    if (!userId) return;
    currentMonthEl.textContent = currentDisplayDate.toLocaleString('default', { month: 'long' });
    currentDateEl.textContent = currentDisplayDate.toLocaleDateString('en-US', { day: 'numeric' });
    activitiesContainer.innerHTML = '';
    renderActivities(currentDisplayDate, activitiesContainer);
    renderCustomTasks(currentDisplayDate, activitiesContainer);
    renderIncompleteActivities();
}

function renderActivities(date, container) {
    const activities = getActivitiesForDate(date);
    const dateKey = formatDateKey(date);
    if (activities.length === 0 && Object.values(customTasks).filter(t => t.date === dateKey).length === 0) {
        container.innerHTML = `<p class="text-gray-500">No planned activities for today. Enjoy the day off!</p>`;
    }
    activities.forEach((activity, index) => {
        const activityId = `${dateKey}-${index}`;
        const isCompleted = activityStatus[activityId] || false;
        const card = createActivityCard(activity, activityId, isCompleted);
        container.appendChild(card);
    });
}

function renderCustomTasks(date, container) {
    const dateKey = formatDateKey(date);
    Object.keys(customTasks).forEach(taskId => {
        if (customTasks[taskId].date === dateKey) {
            const task = customTasks[taskId];
            const isCompleted = activityStatus[taskId] || false;
            const card = createActivityCard(task, taskId, isCompleted, false, true);
            container.appendChild(card);
        }
    });
}

function renderIncompleteActivities() {
    const allIncompleteTasks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(2025, 6, 1);

    for (let d = new Date(startDate); d < today; d.setDate(d.getDate() + 1)) {
        const dateKey = formatDateKey(d);
        const activities = getActivitiesForDate(new Date(d));
        activities.forEach((activity, index) => {
            const activityId = `${dateKey}-${index}`;
            if (!activityStatus[activityId]) {
                allIncompleteTasks.push({ activity, activityId, date: new Date(d) });
            }
        });
    }

    incompleteList.innerHTML = '';
    if (allIncompleteTasks.length > 0) {
        incompleteContainer.style.display = 'block';
        if (allIncompleteTasks.length > 3) {
            incompleteList.innerHTML = `
                <div class="text-center p-4 bg-red-50 rounded-lg">
                    <p class="font-semibold text-red-700">You have ${allIncompleteTasks.length} pending activities.</p>
                    <button id="show-all-pending" class="mt-2 text-sm text-blue-600 hover:underline font-bold">Show All</button>
                </div>
            `;
            document.getElementById('show-all-pending').addEventListener('click', () => {
                renderFullIncompleteList(allIncompleteTasks);
            });
        } else {
            renderFullIncompleteList(allIncompleteTasks);
        }
    } else {
        incompleteContainer.style.display = 'none';
    }
}

function renderFullIncompleteList(tasks) {
    incompleteList.innerHTML = '';
    tasks.forEach(taskInfo => {
        const card = createActivityCard(taskInfo.activity, taskInfo.activityId, false, true);
        const dateEl = document.createElement('p');
        dateEl.className = 'text-xs text-red-500 font-semibold mt-1';
        dateEl.textContent = taskInfo.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        card.querySelector('div').appendChild(dateEl);
        incompleteList.appendChild(card);
    });
}

function createActivityCard(activity, activityId, isCompleted, isPending = false, isCustom = false) {
    const card = document.createElement('div');
    card.className = `activity-card bg-white p-4 rounded-lg shadow-sm border-l-4 ${isCompleted ? 'completed' : ''} ${isPending ? 'bg-red-50' : ''}`;
    card.style.borderLeftColor = isPending && !isCompleted ? '#ef4444' : getCategoryColor(activity.cat || 'Custom');

    const cardContent = `
        <div class="flex justify-between items-start">
            <div class="flex-1 min-w-0">
                <div class="flex items-center">
                    ${isCompleted ? '<span class="star-icon mr-2">⭐</span>' : ''}
                    <h3 class="font-bold text-lg activity-title">${activity.title || activity.cat}</h3>
                </div>
                <p class="text-gray-600 truncate activity-desc">${activity.desc}</p>
            </div>
            <div class="flex items-center ml-4 flex-shrink-0">
                <button class="add-to-calendar-btn p-2 text-gray-400 hover:text-blue-500" title="Add to Calendar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
                </button>
                ${activity.link ? `<a href="${activity.link}" target="_blank" class="p-2 text-gray-400 hover:text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" /></svg></a>` : ''}
                ${isCustom ? `<button class="delete-task-btn p-2 text-gray-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg></button>` : ''}
                <input type="checkbox" class="task-checkbox h-6 w-6 rounded text-blue-500 ml-2" ${isCompleted ? 'checked' : ''}>
            </div>
        </div>
    `;
    card.innerHTML = cardContent;

    card.addEventListener('click', () => openModal('activity-modal', activity.title || activity.cat, activity.desc));
    card.querySelector('.task-checkbox').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleActivity(activityId, isCustom);
    });
    card.querySelector('.add-to-calendar-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openCalendarModal(activity, activityId);
    });
    if (isCustom) {
        card.querySelector('.delete-task-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCustomTask(activityId);
        });
    }
    if (activity.link) {
        card.querySelector('a').addEventListener('click', (e) => e.stopPropagation());
    }

    return card;
}

function renderCalendar(year, month) {
    calendarGrid.innerHTML = '';
    calendarMonthYearEl.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => { calendarGrid.appendChild(Object.assign(document.createElement('div'), { className: 'font-bold text-gray-600', textContent: day })); });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) { calendarGrid.appendChild(document.createElement('div')); }
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('button');
        dayEl.className = 'calendar-day p-2 rounded-full hover:bg-blue-100 transition-colors';
        dayEl.textContent = i;
        const date = new Date(year, month, i);
        if (getActivitiesForDate(date).length > 0) { dayEl.classList.add('has-activity'); }
        dayEl.addEventListener('click', () => {
            calendarActivityDate.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            renderCalendarActivities(date, calendarActivityList);
            calendarActivityView.style.display = 'block';
            document.querySelectorAll('.calendar-day.bg-blue-500').forEach(d => d.classList.remove('bg-blue-500', 'text-white'));
            dayEl.classList.add('bg-blue-500', 'text-white');
        });
        calendarGrid.appendChild(dayEl);
    }
}

function renderCalendarActivities(date, container) {
    container.innerHTML = '';
    const activities = getActivitiesForDate(date);
    if (activities.length === 0) { container.innerHTML = `<p class="text-gray-500">No planned activities.</p>`; return; }
    activities.forEach(activity => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-lg shadow-sm border-l-4';
        card.style.borderLeftColor = getCategoryColor(activity.cat);
        card.innerHTML = `<h3 class="font-bold text-lg">${activity.cat}</h3><p class="text-gray-600">${activity.desc}</p>`;
        container.appendChild(card);
    });
}

function renderSidebar() {
    monthlyPlanLinksContainer.innerHTML = '';
    const months = Object.keys(learningPlan[2025]).concat(Object.keys(learningPlan[2026]));
    months.forEach((month) => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'block p-2 rounded hover:bg-gray-100';
        a.textContent = month;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const monthIndex = new Date(Date.parse(month +" 1, 2025")).getMonth();
            const year = monthIndex >= 6 ? 2025 : 2026;
            currentDisplayDate = new Date(year, monthIndex, 1);
            showCalendarView();
            toggleSidebar();
        });
        monthlyPlanLinksContainer.appendChild(a);
    });
}

function updateStarDisplay() {
    starCountBadge.textContent = starCount;
    totalStarsDisplay.textContent = starCount;
}

function renderStarGrid() {
    starGrid.innerHTML = '';
    for (let i = 0; i < starCount; i++) {
        starGrid.appendChild(Object.assign(document.createElement('span'), { className: 'star-icon text-3xl', textContent: '⭐' }));
    }
}

// ===================================================================
// EVENT HANDLERS & VIEW SWITCHING
// ===================================================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
    sidebarOverlay.classList.toggle('hidden');
}

function showMainView() {
    mainView.style.display = 'block';
    calendarView.style.display = 'none';
    rewardsView.style.display = 'none';
    renderMainView();
}

function showCalendarView() {
    mainView.style.display = 'none';
    rewardsView.style.display = 'none';
    calendarView.style.display = 'block';
    renderCalendar(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
    calendarActivityView.style.display = 'none';
}

function showRewardsView() {
    mainView.style.display = 'none';
    calendarView.style.display = 'none';
    rewardsView.style.display = 'block';
    renderStarGrid();
}

function openModal(modalId, title, description) {
    const modal = document.getElementById(modalId);
    if(modal) {
        if(title && description) {
            modal.querySelector('#modal-title').textContent = title;
            modal.querySelector('#modal-description').textContent = description;
        }
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => { modal.classList.remove('opacity-0'); modal.firstElementChild.classList.remove('scale-95'); }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.firstElementChild.classList.add('scale-95');
        modal.classList.add('opacity-0');
        setTimeout(() => { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; }, 300);
    }
}

function openCustomTaskModal() {
    document.getElementById('custom-task-title').value = '';
    document.getElementById('custom-task-desc').value = '';
    document.getElementById('custom-task-link').value = '';
    openModal('custom-task-modal');
}

async function addCustomTask() {
    const title = document.getElementById('custom-task-title').value.trim();
    const desc = document.getElementById('custom-task-desc').value.trim();
    const link = document.getElementById('custom-task-link').value.trim();
    if (!title) { alert("Please enter a title for the activity."); return; }

    const newTaskId = `custom_${Date.now()}`;
    const taskData = { title, desc, link, date: formatDateKey(currentDisplayDate), createdAt: new Date() };

    try {
        await setDoc(doc(db, `artifacts/kg-planner-app/users/${userId}/custom_activities`, newTaskId), taskData);
        closeModal('custom-task-modal');
    } catch (error) { console.error("Error adding custom task:", error); alert("Could not add task."); }
}

async function deleteCustomTask(taskId) {
    if (!confirm("Are you sure you want to delete this custom task?")) return;
    
    const taskRef = doc(db, `artifacts/kg-planner-app/users/${userId}/custom_activities`, taskId);
    await deleteDoc(taskRef).catch(error => console.error("Error deleting task:", error));

    if (activityStatus[taskId]) {
        const statusRef = doc(db, `artifacts/kg-planner-app/users/${userId}/activities`, taskId);
        await deleteDoc(statusRef).catch(error => console.error("Error deleting task status:", error));
        const newStarCount = Math.max(0, starCount - 1);
        const starsRef = doc(db, `artifacts/kg-planner-app/users/${userId}/rewards/stars`);
        await setDoc(starsRef, { count: newStarCount });
    }
}

// ===================================================================
// CALENDAR INTEGRATION FUNCTIONS
// ===================================================================
function openCalendarModal(activity, activityId) {
    // activityId is in the format "YYYY-M-D-index" or "custom_timestamp"
    let activityDate;
    if (activityId.startsWith('custom')) {
        activityDate = new Date(customTasks[activityId].date.replace(/-/g, '/'));
    } else {
        const parts = activityId.split('-');
        activityDate = new Date(parts[0], parts[1] - 1, parts[2]);
    }
    
    activeCalendarActivity = {
        title: activity.title || activity.cat,
        description: activity.desc,
        date: activityDate
    };
    openModal('calendar-modal');
}

function formatGoogleDate(date) {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 8);
}

function handleGoogleCalendar() {
    if (!activeCalendarActivity) return;
    
    const { title, description, date } = activeCalendarActivity;
    const startDate = formatGoogleDate(date);
    const endDate = formatGoogleDate(new Date(date.getTime() + 24 * 60 * 60 * 1000)); // Next day for all-day event
    
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${startDate}/${endDate}`;
    
    window.open(url, '_blank');
    closeModal('calendar-modal');
}

function handleAppleCalendar() {
    if (!activeCalendarActivity) return;

    const { title, description, date } = activeCalendarActivity;
    const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:${startDate.slice(0,8)}
DTEND;VALUE=DATE:${endDate.slice(0,8)}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    closeModal('calendar-modal');
}

// ===================================================================
// FIREBASE FUNCTIONS
// ===================================================================
async function toggleActivity(activityId, isCustom = false) {
    const currentStatus = activityStatus[activityId] || false;
    const newStatus = !currentStatus;
    const starsRef = doc(db, `artifacts/kg-planner-app/users/${userId}/rewards/stars`);
    const activityRef = doc(db, `artifacts/kg-planner-app/users/${userId}/activities`, activityId);
    
    activityStatus[activityId] = newStatus;
    if (newStatus) { starCount++; } else { starCount = Math.max(0, starCount - 1); }
    
    renderMainView();
    updateStarDisplay();

    try {
        if (newStatus) { await setDoc(activityRef, { completed: true, isCustom }); } 
        else { await deleteDoc(activityRef); }
        await setDoc(starsRef, { count: starCount });
    } catch (error) { console.error("Error updating activity:", error); }
}

async function initFirebase() {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        const appId = 'kg-planner-app';

        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                if (activityStatusUnsubscribe) activityStatusUnsubscribe();
                if (customTasksUnsubscribe) customTasksUnsubscribe();
                if (rewardsUnsubscribe) rewardsUnsubscribe();
                
                activityStatusUnsubscribe = onSnapshot(collection(db, `artifacts/${appId}/users/${userId}/activities`), (snap) => { activityStatus = {}; snap.forEach(doc => activityStatus[doc.id] = doc.data().completed); renderMainView(); });
                customTasksUnsubscribe = onSnapshot(collection(db, `artifacts/${appId}/users/${userId}/custom_activities`), (snap) => { customTasks = {}; snap.forEach(doc => customTasks[doc.id] = doc.data()); renderMainView(); });
                rewardsUnsubscribe = onSnapshot(doc(db, `artifacts/${appId}/users/${userId}/rewards/stars`), (doc) => { starCount = doc.exists() ? doc.data().count : 0; updateStarDisplay(); });
                
                loadingOverlay.style.display = 'none';
            }
        });

        await signInAnonymously(auth);
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
        loadingOverlay.innerHTML = `<p class="text-red-500">Error connecting. Please refresh.</p>`;
    }
}

// ===================================================================
// INITIALIZATION
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    renderSidebar();
    
    menuButton.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
    rewardsButton.addEventListener('click', showRewardsView);
    addCustomTaskButton.addEventListener('click', openCustomTaskModal);
    backToHomeButton.addEventListener('click', showMainView);
    rewardsBackButton.addEventListener('click', showMainView);
    currentMonthEl.addEventListener('click', showCalendarView);
    
    prevMonthBtn.addEventListener('click', () => {
        currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
        renderCalendar(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
        calendarActivityView.style.display = 'none';
    });
    nextMonthBtn.addEventListener('click', () => {
        currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
        renderCalendar(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
        calendarActivityView.style.display = 'none';
    });

    activityModal.addEventListener('click', () => closeModal('activity-modal'));
    modalCloseButton.addEventListener('click', () => closeModal('activity-modal'));
    customTaskModal.addEventListener('click', () => closeModal('custom-task-modal'));
    customTaskCancelButton.addEventListener('click', () => closeModal('custom-task-modal'));
    customTaskAddButton.addEventListener('click', addCustomTask);

    // listeners for the new calendar modal
    googleCalButton.addEventListener('click', handleGoogleCalendar);
    appleCalButton.addEventListener('click', handleAppleCalendar);
    calendarModalCloseButton.addEventListener('click', () => closeModal('calendar-modal'));
    calendarModal.addEventListener('click', () => closeModal('calendar-modal'));
});
