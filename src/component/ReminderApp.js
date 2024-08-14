import React, { useState, useEffect } from 'react';
import { DatePicker, notification } from 'antd';
import moment from 'moment';
import './ReminderApp.css';

const ReminderApp = () => {
  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem('reminders');// Lấy dữ liệu lời nhắc từ localStorage
    return savedReminders ? JSON.parse(savedReminders) : [];// Khởi tạo state 'reminders' với dữ liệu từ localStorage hoặc mảng rỗng
  });
  const [content, setContent] = useState('');// State để lưu trữ nội dung lời nhắc
  const [date, setDate] = useState(null);// State để lưu trữ ngày nhắc

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));// Lưu dữ liệu vào localStorage mỗi khi 'reminders' thay đổi
  }, [reminders]);

  const handleAddReminder = () => {
    if (!content || !date) {//Kiểm tra nếu chưa nhập nội dung hoặc chọn ngày nhắc
      alert('Bạn chưa nhập nội dung hoặc chọn ngày nhắc.');
      return;
    }
    const newReminder = { content, date };// Tạo lời nhắc mới
    setReminders([...reminders, newReminder]);// Thêm lời nhắc mới vào danh sách 'reminders'
    setContent('');// Reset nội dung
    setDate(null);// Reset ngày nhắc
  };

  const checkReminders = () => {
    const today = moment().startOf('day');// Lấy ngày hiện tại
    reminders.forEach(reminder => {
      if (moment(reminder.date).isSame(today, 'day')) {// Kiểm tra nếu có lời nhắc cho hôm nay
        notification.open({
          message: 'Nhắc nhở hôm nay',
          description: reminder.content,// Nội dung thông báo
        });
      }
    });
  };

  useEffect(() => {// Kiểm tra lời nhắc mỗi khi 'reminders' thay đổi
    checkReminders();
  }, [reminders]);

  return (
    <div className="reminder-app">
      <div className='reminder-form'>
      <h1>NHẮC NHỞ NGÀY QUAN TRỌNG CỦA BẠN</h1>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nội dung"
      />
      <DatePicker
        value={date ? moment(date) : null}// Cập nhật state 'content' khi người dùng nhập nội dung
        onChange={(date) => setDate(date ? date.format('YYYY-MM-DD') : null)}
        disabledDate={(current) => current && current < moment().startOf('day')}// Chỉ cho phép chọn ngày hiện tại và sau đó
      />
      <button onClick={handleAddReminder}>Lưu Ngày</button>
      </div>
      
      <div className="reminders-list">
        {reminders.map((reminder, index) => (// Hiển thị danh sách các lời nhắc
          <div className="reminder-date" key={index} className={moment(reminder.date).isSame(moment(), 'day') ? 'highlight' : ''}>
           <hr/> Ngày: {moment(reminder.date).format('DD/MM/YYYY')} - {reminder.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderApp;
