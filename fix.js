document.addEventListener('DOMContentLoaded',function(){
  // Fix 1: Remove track pants from womens jeans slider
  var s=document.querySelector('#womensSlider');
  if(s){Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});}
  
  // Fix 2: Checkout button saves cart and redirects to checkout.html
  var btn=document.querySelector('.cart-checkout');
  if(btn){btn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});}
});
