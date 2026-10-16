/* =====================================================================
   AYAR — TÜM İÇERİK (metinler, fiyatlar, iletişim, saatler…)
   Sitedeki her şeyi buradan değiştirebilirsiniz. HTML'e dokunmanıza gerek yok.
   Görseller: "img" alanlarını boş bırakırsanız şık bir placeholder görünür.
   BURAYA GERÇEK FOTOĞRAF → img alanına "img/dosya.webp" gibi yol yazın.
   (Önerilen: WebP, 800x600 px kartlar için, 1600x1000 px hero için)
   ===================================================================== */
const CONFIG = {
  business: {
    name: "Sülüman Tantuni & Döner",
    logoText: "Sülüman",
    logoSub: "Tantuni & Döner",
    logoImg: "Gorsel/icon.png",
    phone: "903245151977",
    phoneDisplay: "0 324 515 19 77",
    whatsapp: "903245151977",
    instagram: "sulumantantunidoner",
    address: {
      street: "Süzerler Apartmanı, Akdeniz Mah. No:186 G-H",
      district: "Erdemli",
      city: "Mersin",
      postalCode: "33730",
      country: "TR"
    },
    mapsLink: "https://maps.app.goo.gl/GX7oecPCWkuxKjbN9",
    mapEmbed: "",
    geo: { lat: 36.6083, lng: 34.3089 },
    url: "https://www.ornekalanadi.com/",
    priceRange: "₺₺",
    founded: ""
  },

  // Hazır WhatsApp mesajları ({urun} otomatik ürün adıyla değişir)
  whatsapp: {
    general: "Merhaba, sipariş vermek istiyorum.",
    product: "Merhaba, {urun} sipariş vermek istiyorum."
  },

  currency: "₺",

  // Online sipariş platformları – link boşsa buton gösterilmez
  platforms: [
    { name: "Yemeksepeti", url: "", color: "#FA0050" },
    { name: "Getir Yemek", url: "", color: "#5D3EBC" },
    { name: "Trendyol Yemek", url: "", color: "#F27A1A" }
  ],

  // Çalışma saatleri
  hours: [
    { label: "Pazartesi – Cumartesi", days: ["Mo", "Tu", "We", "Th", "Fr", "Sa"], open: "11:00", close: "00:00" },
    { label: "Pazar", days: ["Su"], open: "12:00", close: "23:00" }
  ],

  hero: {
    eyebrow: "Tantuni & Döner · Erdemli / Mersin",
    title: "Siparişe özel, kızgın saçta.",
    titleAccent: "Sıcak sıcak.",
    sub: "%100 yaprak et döner, çıtır lavaş tantuni ve enfes Antakya soslu tavuk döner. Sen söyle, biz saçı kızdıralım.",
    orderBtn: "Hemen Sipariş Ver",
    menuBtn: "Menüyü Gör",
    chips: ["Paket servis var", "Ortalama 10 dk", "Erdemli İçi Hızlı Teslimat"],
    video: "",
    image: "Gorsel/Background.png"
  },

  // Bölüm başlıkları
  texts: {
    popular: { eyebrow: "En çok sevilenler", title: "Popüler Lezzetler", sub: "Kararsız kaldıysan buradan başla. Hepsi siparişe özel hazırlanır." },
    menu: { eyebrow: "Menü & Fiyatlar", title: "Ne Yiyoruz?", sub: "Kategoriye dokun, dilediğin lezzeti WhatsApp'tan tek dokunuşla sipariş ver." },
    why: { eyebrow: "Neden biz", title: "Farkı Tadında", sub: "" },
    order: { eyebrow: "Sipariş", title: "Acıktın mı? Hemen Söyle.", sub: "En hızlı sipariş WhatsApp üzerinden. Dilersen telefonla da arayabilirsin." },
    instagram: { eyebrow: "@sulumantantunidoner", title: "Saçtan Kareler", sub: "Günün lezzetleri, kampanyalar ve mutfağımızdan anlar.", button: "Bizi Instagram'da Takip Et" },
    reviews: { eyebrow: "Müşteri yorumları", title: "Doyan Konuşuyor", sub: "" },
    location: { eyebrow: "Konum & saatler", title: "Gel Ve Sıcak Ye", sub: "", button: "Yol Tarifi Al" },
    footer: "Siparişe özel, kızgın saçta. Sıcak sıcak."
  },

  // Popüler ürünler
  popular: [
    { name: "Et Döner Dürüm (80g)", desc: "%100 yaprak et döner, ince lavaş, domates, sumaklı soğan.", price: 340, badge: "En çok satan", emoji: "🌯", img: "Gorsel/Gorsel1.jpg" },
    { name: "Dürüm Tantuni", desc: "Mersin usulü saçta sotelenmiş dana eti, domates, maydanoz, sumaklı soğan.", price: 240, badge: "Mersin Lezzeti", emoji: "🌯", img: "Gorsel/Gorsel1.jpg" },
    { name: "Tavuk Döner Dürüm (80g)", desc: "Eski usul soslu tavuk döner, patates, kornişon turşu, ince lavaş.", price: 190, badge: "Fiyatı dost", emoji: "🍗", img: "Gorsel/Gorsel1.jpg" },
    { name: "Antakya Usulü Tavuk Dürüm", desc: "Özel soslu lavaş, sarımsaklı mayonez, çıtır patates.", price: 190, badge: "Özel Soslu", emoji: "🌯", img: "Gorsel/Gorsel1.jpg" },
    { name: "Et Döner İskender (1 Porsiyon)", desc: "Pide üstü %100 yaprak et döner (120g), tereyağı, domates sosu, süzme yoğurt.", price: 490, badge: "Ustanın favorisi", emoji: "🧈", img: "Gorsel/Gorsel1.jpg" },
    { name: "Zurna Tavuk Dürüm", desc: "Ekstra uzun çıtır lavaş, bol soslu tavuk döner, patates.", price: 190, badge: "Doyurucu", emoji: "🥙", img: "Gorsel/Gorsel1.jpg" }
  ],

  // Menü: Kategoriler ve ürünler
  menu: [
    {
      id: "et-doner",
      name: "Et Döner",
      items: [
        { name: "Et Döner Dürüm (80 Gr.)", desc: "%100 yaprak döner, ince lavaş, sumaklı soğan, domates", price: 340 },
        { name: "Et Döner Somun Ekmek (80 Gr.)", desc: "Taze somun ekmek arası bol et döner", price: 340 },
        { name: "Et Döner Gobit Ekmek (80 Gr.)", desc: "Puf gobit ekmek arası yaprak et döner", price: 340 },
        { name: "Et Döner Servis (1 Porsiyon - 120 Gr.)", desc: "Tırnak pide, közlenmiş biber, domates ve salata ile", price: 490 },
        { name: "Et Döner Servis (1.5 Porsiyon - 180 Gr.)", desc: "Ekstra bol et (180g), tırnak pide, közlenmiş biber, domates", price: 590 },
        { name: "Et Döner Pilav Üstü (1 Porsiyon - 120 Gr.)", desc: "Tereyağlı pirinç pilavı üstünde yaprak et döner", price: 490 },
        { name: "Et Döner Pilav Üstü (1.5 Porsiyon - 180 Gr.)", desc: "Bol yaprak et (180g), tereyağlı pilav, közlenmiş domates/biber", price: 590 },
        { name: "Et Döner İskender (1 Porsiyon - 120 Gr.)", desc: "Küp pide üstü yaprak et, kızgın tereyağı, domates sos, yoğurt", price: 490 },
        { name: "Et Döner İskender (1.5 Porsiyon - 180 Gr.)", desc: "Doyurucu 1.5 porsiyon yaprak et, tereyağı, özel sos, yoğurt", price: 590 }
      ]
    },
    {
      id: "tavuk-doner",
      name: "Tavuk Döner",
      items: [
        { name: "Tavuk Dürüm Eski Usül (80 Gr.)", desc: "Soslu tavuk döner, patates, turşu, lavaş", price: 190 },
        { name: "Tavuk Somun Ekmek (80 Gr.)", desc: "Çıtır somun ekmek arası tavuk döner", price: 190 },
        { name: "Tavuk Gobit Ekmek (80 Gr.)", desc: "Yumuşak gobit ekmek arası tavuk döner", price: 190 },
        { name: "Antakya Usulü Dürüm", desc: "Özel soslu lavaş, sarımsaklı mayonez, patates kızartması", price: 190 },
        { name: "Zurna Dürüm", desc: "Ekstra uzun lavaş, bol soslu tavuk döner", price: 190 },
        { name: "Bazuka Dürüm", desc: "Özel sarım, ekstra doyurucu tavuk döner", price: 190 },
        { name: "Tavuk Döner Servis (1 Porsiyon - 120 Gr.)", desc: "Pide, patates, turşu ve yeşillik ile", price: 340 },
        { name: "Tavuk Döner Servis (1.5 Porsiyon - 180 Gr.)", desc: "1.5 porsiyon tavuk döner, patates, turşu", price: 440 },
        { name: "Tavuk Döner Pilav Üstü (1 Porsiyon - 120 Gr.)", desc: "Tereyağlı pirinç pilavı üstü tavuk döner", price: 340 },
        { name: "Tavuk Döner Pilav Üstü (1.5 Porsiyon - 180 Gr.)", desc: "1.5 porsiyon tavuk, pirinç pilavı, közlenmiş biber", price: 440 },
        { name: "Tavuk Döner İskender (1 Porsiyon - 120 Gr.)", desc: "Pide üstü tavuk döner, tereyağı, domates sos, yoğurt", price: 340 },
        { name: "Tavuk Döner İskender (1.5 Porsiyon - 180 Gr.)", desc: "Doyurucu 1.5 porsiyon tavuk döner, tereyağı, yoğurt", price: 440 }
      ]
    },
    {
      id: "tantuni",
      name: "Tantuni",
      items: [
        { name: "Dürüm Tantuni (Et)", desc: "Mersin usulü incecik lavaşta dana eti, domates, maydanoz, sumaklı soğan", price: 240 },
        { name: "Somun Tantuni (Et)", desc: "Çıtır somun ekmek arası saçta sotelenmiş dana tantuni", price: 240 },
        { name: "Yoğurtlu Tantuni", desc: "Lavaş tantuni üzeri süzme yoğurt ve kızgın tereyağlı pul biber", price: 280 },
        { name: "Porsiyon Tantuni (Servis)", desc: "Lavaş üstü bol tantuni eti, közlenmiş biber ve domatesle", price: 320 },
        { name: "Tavuk Tantuni Dürüm", desc: "Saçta sotelenmiş taze tavuk eti, domates, maydanoz, soğan", price: 180 }
      ]
    },
    {
      id: "yaninda",
      name: "Yanında",
      items: [
        { name: "Patates Kızartması", desc: "Çıtır, bol porsiyon patates kızartması", price: 90 },
        { name: "Acılı Ezme", desc: "Günlük, taze el yapımı ezme", price: 60 },
        { name: "Sumaklı Soğan", desc: "İnce kıyım maydanozlu ve sumaklı soğan söğüş", price: 40 },
        { name: "Turşu Tabağı", desc: "Ev turşusu, biber ve salatalık", price: 50 },
        { name: "Közlenmiş Biber & Domates", desc: "Saçta közlenmiş acı/tatlı biberler", price: 40 }
      ]
    },
    {
      id: "icecek",
      name: "İçecek",
      items: [
        { name: "Yayık Ayran", desc: "Bol köpüklü, soğuk yayık ayranı", price: 40 },
        { name: "Şalgam Suyu", desc: "Acılı / acısız buz gibi şalgam", price: 45 },
        { name: "Kola / Fanta / Sprite", desc: "33 cl kutu meşrubat", price: 60 },
        { name: "Gazoz", desc: "Cam şişe klasik gazoz", price: 50 },
        { name: "Çay", desc: "Taze demlenmiş ince belli bardakta", price: 20 },
        { name: "Su", desc: "50 cl pet şişe", price: 15 }
      ]
    }
  ],

  // Neden biz
  why: [
    { icon: "leaf", title: "%100 Yaprak Döner", text: "Kıymadan değil, saf yaprak etten özenle takılan gerçek döner lezzeti." },
    { icon: "flame", title: "Siparişe Özel Saçta", text: "Önceden beklemiş ürün yok; her tantuni siparişin verildiği an kızgın saçta pişer." },
    { icon: "bolt", title: "Hızlı & Sıcak Servis", text: "Erdemli içi siparişleriniz ortalama 10-15 dakikada dumanı üstünde kapınızda." },
    { icon: "tag", title: "Uygun & Doyurucu", text: "Dolu dolu porsiyonlar, cebinizi yakmayan net ve dostane fiyatlar." }
  ],

  // Instagram ızgarası
  instagramPosts: [
    { img: "Gorsel/Gorsel1.jpg", alt: "Saçta pişen tantuni", emoji: "🔥" },
    { img: "Gorsel/Gorsel1.jpg", alt: "Dürüm tantuni yakın çekim", emoji: "🌯" },
    { img: "Gorsel/Gorsel1.jpg", alt: "%100 yaprak et döner kesimi", emoji: "🥙" },
    { img: "Gorsel/Gorsel1.jpg", alt: "Yoğurtlu tantuni", emoji: "🥣" },
    { img: "Gorsel/Gorsel1.jpg", alt: "Yayık ayran", emoji: "🥛" },
    { img: "Gorsel/Gorsel1.jpg", alt: "Sülüman Tantuni & Döner salonu", emoji: "🏪" }
  ],

  // Müşteri yorumları
  reviews: [
    { name: "Mert K.", rating: 5, source: "Google", text: "%100 yaprak et döneri Erdemli'de yiyebileceğiniz en iyi döner. İskenderi ve yoğurtlu tantunisi efsane." },
    { name: "Elif S.", rating: 5, source: "Google", text: "Antakya usulü tavuk dürüm çok lezzetli, sosu tam kıvamında. Servis inanılmaz hızlı geldi." },
    { name: "Burak T.", rating: 5, source: "Google", text: "Somun ekmekte et döner porsiyon olarak çok doyurucu. WhatsApp'tan sipariş vermek çok pratik." }
  ]
};