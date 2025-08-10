// 乒乓球課程預約系統 JavaScript

// 應用程式數據
let appData = {
  availableSlots: [
    {
      id: 1,
      date: "2025-08-15",
      time: "09:00-10:00",
      type: "一對一課程",
      price: 350,
      maxStudents: 1,
      bookedStudents: 0,
      coach: "張教練"
    },
    {
      id: 2,
      date: "2025-08-15",
      time: "10:00-11:00",
      type: "小組課程",
      price: 150,
      maxStudents: 4,
      bookedStudents: 2,
      coach: "李教練"
    },
    {
      id: 3,
      date: "2025-08-15",
      time: "14:00-15:00",
      type: "一對一課程",
      price: 350,
      maxStudents: 1,
      bookedStudents: 0,
      coach: "王教練"
    },
    {
      id: 4,
      date: "2025-08-16",
      time: "09:00-10:00",
      type: "小組課程",
      price: 150,
      maxStudents: 4,
      bookedStudents: 1,
      coach: "張教練"
    },
    {
      id: 5,
      date: "2025-08-16",
      time: "15:00-16:00",
      type: "一對一課程",
      price: 350,
      maxStudents: 1,
      bookedStudents: 0,
      coach: "李教練"
    }
  ],
  users: [
    {
      id: 1,
      parentName: "陳太太",
      phone: "9123-4567",
      email: "chan@email.com",
      studentName: "陳小明",
      studentAge: 10,
      level: "初學者"
    }
  ],
  bookings: [
    {
      id: 1,
      userId: 1,
      slotId: 2,
      status: "已確認",
      bookingTime: "2025-08-11 14:30"
    }
  ],
  priceInfo: {
    oneOnOne: 350,
    groupClass: 150,
    cancellationPolicy: "需於課程開始前24小時取消，否則不予退款"
  },
  coachInfo: [
    {
      name: "張教練",
      experience: "10年教學經驗",
      specialty: "兒童基礎訓練"
    },
    {
      name: "李教練", 
      experience: "8年教學經驗",
      specialty: "技術提升"
    },
    {
      name: "王教練",
      experience: "12年教學經驗", 
      specialty: "比賽訓練"
    }
  ]
};

// 應用程式狀態
let appState = {
  currentUser: null,
  currentPage: 'homepage',
  selectedSlot: null,
  isCoachMode: false
};

// 頁面導航功能
function showPage(pageId) {
  // 隱藏所有頁面
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // 顯示目標頁面
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  appState.currentPage = pageId;

  // 顯示/隱藏導航欄
  const navbar = document.getElementById('navbar');
  if (pageId === 'homepage' || pageId === 'register-page' || pageId === 'login-page') {
    navbar.style.display = 'none';
  } else {
    navbar.style.display = 'block';
  }
}

// 導航函數
window.showHomepage = function() {
  showPage('homepage');
};

window.showRegister = function() {
  showPage('register-page');
};

window.showLogin = function() {
  showPage('login-page');
};

window.showBooking = function() {
  if (!appState.currentUser) {
    showLogin();
    return;
  }
  showPage('booking-page');
  updateWelcomeText();
  initializeDateSelector();
};

window.showConfirm = function() {
  showPage('confirm-page');
  updateConfirmationDetails();
};

window.showBookings = function() {
  if (!appState.currentUser) {
    showLogin();
    return;
  }
  showPage('my-bookings-page');
  loadUserBookings();
};

window.showCoachLogin = function() {
  appState.isCoachMode = true;
  showPage('coach-page');
  loadCoachData();
};

// 更新歡迎文字
function updateWelcomeText() {
  if (appState.currentUser) {
    const welcomeElement = document.getElementById('welcomeUser');
    if (welcomeElement) {
      welcomeElement.textContent = appState.currentUser.parentName;
    }
  }
}

// 初始化日期選擇器
function initializeDateSelector() {
  const dateSelector = document.getElementById('dateSelector');
  if (!dateSelector) return;
  
  const today = new Date();
  today.setDate(today.getDate() + 4); // 設置為8月15日
  
  // 設置默認日期
  dateSelector.value = '2025-08-15';
  
  // 移除之前的事件監聽器
  dateSelector.removeEventListener('change', handleDateChange);
  // 綁定日期變更事件
  dateSelector.addEventListener('change', handleDateChange);
  
  // 載入初始時間段
  loadAvailableSlots(dateSelector.value);
}

function handleDateChange(e) {
  loadAvailableSlots(e.target.value);
}

// 載入可用時間段
function loadAvailableSlots(selectedDate) {
  const slotsContainer = document.getElementById('availableSlots');
  if (!slotsContainer) return;
  
  const slots = appData.availableSlots.filter(slot => slot.date === selectedDate);
  
  if (slots.length === 0) {
    slotsContainer.innerHTML = '<p class="text-secondary">此日期暫無可用時間段</p>';
    return;
  }

  slotsContainer.innerHTML = slots.map(slot => {
    const isAvailable = slot.bookedStudents < slot.maxStudents;
    const remainingSpots = slot.maxStudents - slot.bookedStudents;
    
    return `
      <div class="slot-item">
        <div class="slot-info">
          <h4>${slot.time}</h4>
          <div class="slot-details">
            <span>${slot.type}</span>
            <span>${slot.coach}</span>
            <span class="price">$${slot.price}</span>
          </div>
          <div class="slot-availability ${!isAvailable ? 'full' : ''}">
            ${isAvailable ? `剩餘 ${remainingSpots} 個名額` : '已滿'}
          </div>
        </div>
        <div class="slot-actions">
          <button class="btn btn--primary btn--sm" 
                  data-slot-id="${slot.id}"
                  ${!isAvailable ? 'disabled' : ''}>
            ${isAvailable ? '立即預約' : '已滿'}
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  // 綁定預約按鈕事件
  const bookingButtons = slotsContainer.querySelectorAll('button[data-slot-id]');
  bookingButtons.forEach(button => {
    if (!button.disabled) {
      button.addEventListener('click', function() {
        const slotId = parseInt(this.getAttribute('data-slot-id'));
        selectSlot(slotId);
      });
    }
  });
}

// 選擇時間段
window.selectSlot = function(slotId) {
  const slot = appData.availableSlots.find(s => s.id === slotId);
  if (!slot) return;
  
  appState.selectedSlot = slot;
  showConfirm();
};

function selectSlot(slotId) {
  window.selectSlot(slotId);
}

// 更新確認頁面詳情
function updateConfirmationDetails() {
  if (!appState.selectedSlot || !appState.currentUser) return;
  
  const slot = appState.selectedSlot;
  const user = appState.currentUser;
  
  const elements = {
    confirmDateTime: document.getElementById('confirmDateTime'),
    confirmType: document.getElementById('confirmType'),
    confirmCoach: document.getElementById('confirmCoach'),
    confirmStudent: document.getElementById('confirmStudent'),
    confirmPrice: document.getElementById('confirmPrice')
  };
  
  if (elements.confirmDateTime) elements.confirmDateTime.textContent = `${slot.date} ${slot.time}`;
  if (elements.confirmType) elements.confirmType.textContent = slot.type;
  if (elements.confirmCoach) elements.confirmCoach.textContent = slot.coach;
  if (elements.confirmStudent) elements.confirmStudent.textContent = user.studentName;
  if (elements.confirmPrice) elements.confirmPrice.textContent = `$${slot.price}`;
}

// 確認預約
window.confirmBooking = function() {
  if (!appState.selectedSlot || !appState.currentUser) return;
  
  const newBooking = {
    id: appData.bookings.length + 1,
    userId: appState.currentUser.id,
    slotId: appState.selectedSlot.id,
    status: '已確認',
    bookingTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
  };
  
  appData.bookings.push(newBooking);
  
  // 更新時間段的預約人數
  const slot = appData.availableSlots.find(s => s.id === appState.selectedSlot.id);
  if (slot) {
    slot.bookedStudents++;
  }
  
  // 顯示成功提示
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
  
  // 重置選中的時間段
  appState.selectedSlot = null;
};

// 載入用戶預約
function loadUserBookings() {
  if (!appState.currentUser) return;
  
  const bookingsList = document.getElementById('bookingsList');
  if (!bookingsList) return;
  
  const userBookings = appData.bookings.filter(b => b.userId === appState.currentUser.id);
  
  if (userBookings.length === 0) {
    bookingsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <p>您還沒有任何預約</p>
        <button class="btn btn--primary" onclick="showBooking()">立即預約</button>
      </div>
    `;
    return;
  }
  
  bookingsList.innerHTML = userBookings.map(booking => {
    const slot = appData.availableSlots.find(s => s.id === booking.slotId);
    if (!slot) return '';
    
    const canCancel = new Date(slot.date + 'T' + slot.time.split('-')[0]) > 
                     new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    return `
      <div class="booking-item">
        <div class="booking-info">
          <h4>${slot.date} ${slot.time}</h4>
          <div class="booking-meta">
            <span>${slot.type}</span>
            <span>${slot.coach}</span>
            <span class="price">$${slot.price}</span>
          </div>
          <span class="status status--${booking.status === '已確認' ? 'confirmed' : 'cancelled'}">
            ${booking.status}
          </span>
        </div>
        <div class="booking-actions">
          ${canCancel && booking.status === '已確認' ? 
            `<button class="btn btn--outline btn--sm" data-booking-id="${booking.id}">取消預約</button>` : 
            ''}
        </div>
      </div>
    `;
  }).join('');
  
  // 綁定取消預約按鈕事件
  const cancelButtons = bookingsList.querySelectorAll('button[data-booking-id]');
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const bookingId = parseInt(this.getAttribute('data-booking-id'));
      cancelBooking(bookingId);
    });
  });
}

// 取消預約
window.cancelBooking = function(bookingId) {
  if (!confirm('確定要取消此預約嗎？')) return;
  
  const booking = appData.bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  booking.status = '已取消';
  
  // 更新時間段的預約人數
  const slot = appData.availableSlots.find(s => s.id === booking.slotId);
  if (slot) {
    slot.bookedStudents--;
  }
  
  alert('預約已取消');
  loadUserBookings();
};

function cancelBooking(bookingId) {
  window.cancelBooking(bookingId);
}

// 教練功能
function loadCoachData() {
  loadTodaySchedule();
  loadStudentsList();
}

function loadTodaySchedule() {
  const scheduleContainer = document.getElementById('todaySchedule');
  if (!scheduleContainer) return;
  
  const today = '2025-08-15'; // 使用示例日期
  
  // 獲取今天的已預約課程
  const todayBookings = appData.bookings.filter(booking => {
    const slot = appData.availableSlots.find(s => s.id === booking.slotId);
    return slot && slot.date === today && booking.status === '已確認';
  });
  
  if (todayBookings.length === 0) {
    scheduleContainer.innerHTML = '<p class="text-secondary">今日暫無課程安排</p>';
    return;
  }
  
  scheduleContainer.innerHTML = todayBookings.map(booking => {
    const slot = appData.availableSlots.find(s => s.id === booking.slotId);
    const user = appData.users.find(u => u.id === booking.userId);
    
    return `
      <div class="schedule-item">
        <h4>${slot.time} - ${slot.type}</h4>
        <div class="schedule-meta">
          <span>學生: ${user.studentName}</span>
          <span>家長: ${user.parentName}</span>
          <span>聯絡: ${user.phone}</span>
        </div>
      </div>
    `;
  }).join('');
}

function loadStudentsList() {
  const studentsContainer = document.getElementById('studentsList');
  if (!studentsContainer) return;
  
  const students = appData.users.filter(user => user.studentName);
  
  if (students.length === 0) {
    studentsContainer.innerHTML = '<p class="text-secondary">暫無學生資料</p>';
    return;
  }
  
  studentsContainer.innerHTML = students.map(user => `
    <div class="student-item">
      <h4>${user.studentName}</h4>
      <div class="student-meta">
        <span>年齡: ${user.studentAge}</span>
        <span>水平: ${user.level}</span>
        <span>家長: ${user.parentName}</span>
        <span>電話: ${user.phone}</span>
      </div>
    </div>
  `).join('');
}

// 登出功能
window.logout = function() {
  appState.currentUser = null;
  appState.isCoachMode = false;
  appState.selectedSlot = null;
  showHomepage();
};

// 關閉模態框
window.closeModal = function() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('hidden');
  }
  showBookings();
};

// 初始化應用程式
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initializing...');
  
  // 設置日期選擇器的最小日期
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    if (input.hasAttribute('min')) {
      input.min = today;
    }
  });
  
  // 註冊功能
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        parentName: document.getElementById('parentName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        studentName: document.getElementById('studentName').value.trim(),
        studentAge: parseInt(document.getElementById('studentAge').value),
        level: document.getElementById('level').value
      };

      // 基本驗證
      if (!formData.parentName || !formData.phone || !formData.email || 
          !formData.studentName || !formData.studentAge || !formData.level) {
        alert('請填寫所有必填欄位');
        return;
      }

      // 檢查電郵是否已存在
      const existingUser = appData.users.find(user => user.email === formData.email);
      if (existingUser) {
        alert('此電郵地址已被註冊');
        return;
      }

      // 創建新用戶
      const newUser = {
        id: appData.users.length + 1,
        ...formData
      };

      appData.users.push(newUser);
      appState.currentUser = newUser;
      
      alert('註冊成功！');
      showBooking();
    });
  }

  // 登錄功能
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value.trim();
      
      if (!email) {
        alert('請輸入電郵地址');
        return;
      }

      const user = appData.users.find(u => u.email === email);
      if (!user) {
        alert('找不到此用戶，請先註冊');
        return;
      }

      appState.currentUser = user;
      alert('登錄成功！');
      showBooking();
    });
  }

  // 新增時間段功能
  const addSlotForm = document.getElementById('add-slot-form');
  if (addSlotForm) {
    addSlotForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const slotData = {
        id: appData.availableSlots.length + 1,
        date: document.getElementById('slotDate').value,
        time: document.getElementById('slotTime').value + '-' + 
              (parseInt(document.getElementById('slotTime').value.split(':')[0]) + 1).toString().padStart(2, '0') + 
              ':' + document.getElementById('slotTime').value.split(':')[1],
        type: document.getElementById('slotType').value,
        price: document.getElementById('slotType').value === '一對一課程' ? 350 : 150,
        maxStudents: document.getElementById('slotType').value === '一對一課程' ? 1 : 4,
        bookedStudents: 0,
        coach: document.getElementById('slotCoach').value
      };
      
      appData.availableSlots.push(slotData);
      alert('時間段新增成功！');
      this.reset();
    });
  }
  
  // 顯示首頁
  showHomepage();
  
  console.log('App initialized successfully');
});