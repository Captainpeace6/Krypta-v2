document.addEventListener('DOMContentLoaded',function(){

  // Remove track pants from womens slider
  var s=document.querySelector('#womensSlider');
  if(s){Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});}

  // Checkout button
  var btn=document.querySelector('.cart-checkout');
  if(btn){btn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});}

  // Price overrides - Men's Jeans
  var priceMap={
    10:98, // Shadow Cargo - unchanged
    11:118, // Sakura - unchanged
    12:77,  // Red Dragon Print
    13:60,  // Hellfire Pants
    14:75,  // Gold Dragon Jeans
    15:70,  // Skull Cap Wide-Leg
    16:65,  // Dual Dragon Baggy
    17:62,  // One Piece Manga Jeans
    18:68,  // Dark Horror Manga
    19:59,  // JJK Cursed Wide-Leg
    20:64,  // JJK Collage Jeans
    21:70,  // Death Note Wide-Leg
    22:65,  // Baki Red Kanji
    23:67,  // Gojo Full-Leg Print
    24:69,  // Gojo x Geto Jeans
    25:70,  // Black Red JJK Jeans
    32:77,  // Void Distressed Jeans
    33:69,  // Dark Void Baggy
    34:70   // Side Rip Wide-Leg
  };

  // Apply to MENS and WOMENS arrays
  [window.MENS||[], window.WOMENS||[]].forEach(function(arr){
    arr.forEach(function(p){ if(priceMap[p.id]!==undefined) p.price=priceMap[p.id]; });
  });

  // Update any visible price labels on cards
  document.querySelectorAll('.card,[class*=card]').forEach(function(card){
    var pid = card.dataset && (card.dataset.pid || card.dataset.id);
    if(pid && priceMap[parseInt(pid)]!==undefined){
      var priceEl = card.querySelector('[class*=price],[class*=Price]');
      if(priceEl) priceEl.textContent = '$'+priceMap[parseInt(pid)];
    }
  });

});document.addEventListener('DOMContentLoaded',function(){var s=document.querySelector('#womensSlider');if(s){Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});}var btn=document.querySelector('.cart-checkout');if(btn){btn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});}});
