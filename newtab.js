const quotes = [
    "If you want something you never had, you must do something you never did.",
    "Everything happens for a reason.",
    "Love each other or perish.",
    "Good. Now go fail again.",
    "Even a broken clock gets to be right twice a day.",
    "When you're dead, you're dead, and until then there's ice cream.",
    "If you can't say something nice, don't say nothin' at all.",
    "Do good. Have fun. Be kind."
  ];
  
  const lastIndex = parseInt(localStorage.getItem("ponder_index") ?? "-1");
  const nextIndex = (lastIndex + 1) % quotes.length;
  localStorage.setItem("ponder_index", nextIndex);
  
  document.getElementById("quote").textContent = quotes[nextIndex];
  
  setTimeout(() => {
    document.getElementById("quote").classList.add("visible");
  }, 100);
  