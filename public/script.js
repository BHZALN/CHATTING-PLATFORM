try {
  const res = await fetch('/login', { ... });

  // ✅ NEW SAFETY CHECK
  const text = await res.text();
  const data = JSON.parse(text || '{}');

  if (data.success) {
    window.location.href = 'chat.html';
  } else {
    alert(data.message || 'Login failed');
  }
} catch (err) {
  console.error('JSON parse failed or server error', err);
  alert('Server error. Please try again.');
}
