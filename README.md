## YKS SIRALAMA HESAPLAMA VE TERCİH ROBOTU
##### ÖSYM'nin 2019 yılı verilerini kullanarak sıralama hesaplama aracı ve tercih robotu yaptım.
#### [Uygulama](https://yks-puan-siralama.herokuapp.com/)
#### Kullandığım Teknolojiler : 
- ##### Node.js
- ##### Express
- ##### MongoDB
- ##### Heroku


#### Kullandığım veriler :
- ##### [Yığınsal Tablo](https://dokuman.osym.gov.tr/pdfdokuman/2019/YKS/sayisalbilgiler18072019.pdf)
- ##### [Tablo-4 : Lisans Bölümleri Taban Puanları](https://dokuman.osym.gov.tr/pdfdokuman/2019/YKS/tablo4_06082019.pdf)
&nbsp; 

Puan ve sıralama hesabı için yığınsal tabloyu kullandım.

Tablo-4'de yer alan bölüm kodlarını kullanarak [Yök Atlas](https://yokatlas.yok.gov.tr/) üzerinden her bir bölümün taban sıralaması çektim. Bu işlemler sırasında excelden okuma yapmak için xlsx; veri kazıma için jsdom ve got kütüphanelerini kullandım.
