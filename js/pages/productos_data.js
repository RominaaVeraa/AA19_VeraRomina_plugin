const PRODUCTOS_DB = {
  notebooks: {
    notebook1: {
      id: 'notebook1',
      title: 'MSI Modern 15 A11',
      brand: 'MSI',
      model: 'Modern 15 A11',
      price: 89999,
      category: 'Uso Diario',
      type: 'notebook',
      images: [
        'images/Notebook/notebook1.png',
        'images/Notebook/notebook01.png',
        'images/Notebook/notebook001.png',
        'images/Notebook/notebook0001.png'
      ],
      description: 'MSI Modern 15 A11 ideal para uso diario con i5-1135G7, 8GB RAM y 256GB SSD.',
      specifications: {
        'Procesador': 'Intel Core i5-1135G7 (hasta 4.2GHz)',
        'Memoria RAM': '8GB DDR4-3200MHz',
        'Almacenamiento': '256GB SSD NVMe',
        'Pantalla': '15.6" Full HD (1920x1080) Anti-reflejo',
        'Tarjeta Gráfica': 'Intel Iris Xe Graphics',
        'Sistema Operativo': 'Windows 11 Home',
        'Conectividad': 'Wi-Fi 6 (802.11ax), Bluetooth 5.1',
        'Puertos': '2x USB-A 3.2, 1x USB-C, HDMI 1.4, Jack 3.5mm',
        'Batería': 'Hasta 8 horas',
        'Peso': '1.83 kg',
        'Dimensiones': '358.5 x 235 x 18.9 mm',
        'Garantía': '1 año'
      },
      badges: ['value', 'popular'],
      rating: 4.2,
      reviews: 127,
      stock: 15
    },

    notebook2: {
      id: 'notebook2',
      title: 'MSI Katana 15 B12',
      brand: 'MSI',
      model: 'Katana 15 B12',
      price: 124999,
      category: 'Gaming',
      type: 'notebook',
      images: [
        'images/Notebook/notebook2.png',
        'images/Notebook/notebook02.png',
        'images/Notebook/notebook002.png',
        'images/Notebook/notebook0002.png'
      ],
      description: 'MSI Katana 15 B12 para gaming con Ryzen 5 5600H, 16GB RAM y 512GB SSD.',
      specifications: {
        'Procesador': 'AMD Ryzen 5 5600H (hasta 4.2GHz)',
        'Memoria RAM': '16GB DDR4-3200MHz',
        'Almacenamiento': '512GB SSD NVMe',
        'Pantalla': '15.6" Full HD IPS (1920x1080) 144Hz',
        'Tarjeta Gráfica': 'NVIDIA GeForce GTX 1650 4GB',
        'Sistema Operativo': 'Windows 11 Home',
        'Conectividad': 'Wi-Fi 6E, Bluetooth 5.2',
        'Puertos': '3x USB-A 3.2, 1x USB-C, HDMI 2.1, RJ-45',
        'Batería': '6–8 horas',
        'Peso': '2.25 kg',
        'Dimensiones': '360 x 256 x 23.5 mm',
        'Garantía': '2 años'
      },
      badges: ['gaming', 'popular', 'new'],
      rating: 4.5,
      reviews: 89,
      stock: 8
    },

    notebook3: {
      id: 'notebook3',
      title: 'MSI Summit E14 Evo',
      brand: 'MSI',
      model: 'Summit E14 Evo',
      price: 149999,
      category: 'Profesionales',
      type: 'notebook',
      images: [
        'images/Notebook/notebook3.png',
        'images/Notebook/notebook03.png',
        'images/Notebook/notebook003.png',
        'images/Notebook/notebook0003.png'
      ],
      description: 'MSI Summit E14 Evo para profesionales con i7-1165G7, 16GB RAM y 512GB SSD.',
      specifications: {
        'Procesador': 'Intel Core i7-1165G7 (hasta 4.7GHz)',
        'Memoria RAM': '16GB DDR4-3200MHz',
        'Almacenamiento': '512GB SSD NVMe PCIe 4.0',
        'Pantalla': '14" Full HD IPS (1920x1080) Anti-reflejo',
        'Tarjeta Gráfica': 'Intel Iris Xe Graphics',
        'Sistema Operativo': 'Windows 11 Pro',
        'Conectividad': 'Wi-Fi 6, Bluetooth 5.1',
        'Puertos': '2x USB-A 3.2, 2x USB-C/Thunderbolt, HDMI 2.0, RJ-45',
        'Batería': 'Hasta 12 horas',
        'Peso': '1.59 kg',
        'Dimensiones': '324 x 220 x 17.9 mm',
        'Garantía': '3 años'
      },
      badges: ['premium', 'oficina'],
      rating: 4.7,
      reviews: 156,
      stock: 12
    },

    notebook4: {
      id: 'notebook4',
      title: 'MSI Modern 14 C12',
      brand: 'MSI',
      model: 'Modern 14 C12',
      price: 94999,
      category: 'Estudiantes',
      type: 'notebook',
      images: [
        'images/Notebook/notebook4.png',
        'images/Notebook/notebook04.png',
        'images/Notebook/notebook004.png',
        'images/Notebook/notebook0004.png'
      ],
      description: 'MSI Modern 14 C12 para estudiantes, Ryzen 7 5700U, 8GB RAM y 256GB SSD.',
      specifications: {
        'Procesador': 'AMD Ryzen 7 5700U (hasta 4.3GHz)',
        'Memoria RAM': '8GB DDR4-3200MHz',
        'Almacenamiento': '256GB SSD NVMe',
        'Pantalla': '14" Full HD IPS (1920x1080)',
        'Tarjeta Gráfica': 'AMD Radeon Graphics',
        'Sistema Operativo': 'Windows 11 Home',
        'Conectividad': 'Wi-Fi 6, Bluetooth 5.0',
        'Puertos': '2x USB-A 3.2, 1x USB-C 3.2, HDMI 1.4, microSD',
        'Batería': 'Hasta 9 horas',
        'Peso': '1.4 kg',
        'Dimensiones': '324 x 213 x 15.9 mm',
        'Garantía': '2 años'
      },
      badges: ['value', 'new'],
      rating: 4.3,
      reviews: 203,
      stock: 20
    },

    notebook5: {
      id: 'notebook5',
      title: 'MSI Modern 15 A12',
      brand: 'MSI',
      model: 'Modern 15 A12',
      price: 64999,
      category: 'Uso Diario',
      type: 'notebook',
      images: [
        'images/Notebook/notebook5.png',
        'images/Notebook/notebook05.png',
        'images/Notebook/notebook005.png',
        'images/Notebook/notebook0005.png'
      ],
      description: 'MSI Modern 15 A12 económica y eficiente con i3-1115G4, 4GB RAM y 128GB SSD.',
      specifications: {
        'Procesador': 'Intel Core i3-1115G4 (hasta 4.1GHz)',
        'Memoria RAM': '4GB DDR4-2666MHz (expandible)',
        'Almacenamiento': '128GB SSD NVMe',
        'Pantalla': '15.6" Full HD (1920x1080)',
        'Tarjeta Gráfica': 'Intel UHD Graphics',
        'Sistema Operativo': 'Windows 11 Home S',
        'Conectividad': 'Wi-Fi 5, Bluetooth 5.0',
        'Puertos': '2x USB-A 3.2, 1x USB-A 2.0, 1x USB-C, HDMI 1.4, RJ-45',
        'Batería': 'Hasta 7 horas',
        'Peso': '1.9 kg',
        'Dimensiones': '363 x 238 x 17.95 mm',
        'Garantía': '1 año'
      },
      badges: ['value'],
      rating: 3.9,
      reviews: 178,
      stock: 25
    },

    notebook6: {
      id: 'notebook6',
      title: 'MSI GF63 Thin',
      brand: 'MSI',
      model: 'GF63 Thin',
      price: 179999,
      category: 'Gaming',
      type: 'notebook',
      images: [
        'images/Notebook/notebook6.png',
        'images/Notebook/notebook06.png',
        'images/Notebook/notebook006.png',
        'images/Notebook/notebook0006.png'
      ],
      description: 'MSI GF63 Thin con i7-11800H, 16GB RAM, 512GB SSD y RTX 3050 (144Hz).',
      specifications: {
        'Procesador': 'Intel Core i7-11800H (hasta 4.6GHz)',
        'Memoria RAM': '16GB DDR4-3200MHz (2x8GB)',
        'Almacenamiento': '512GB SSD NVMe',
        'Pantalla': '15.6" Full HD IPS 144Hz',
        'Tarjeta Gráfica': 'NVIDIA GeForce RTX 3050 4GB',
        'Sistema Operativo': 'Windows 11 Home',
        'Conectividad': 'Wi-Fi 6E, Bluetooth 5.2',
        'Puertos': '3x USB-A, 1x USB-C, HDMI 2.0, RJ-45',
        'Batería': '5–7 horas',
        'Peso': '1.86 kg',
        'Dimensiones': '359 x 254 x 21.7 mm',
        'Garantía': '2 años'
      },
      badges: ['gaming', 'premium', 'popular'],
      rating: 4.6,
      reviews: 94,
      stock: 6
    },

    notebook7: {
      id: 'notebook7',
      title: 'MSI Prestige 14 Evo',
      brand: 'MSI',
      model: 'Prestige 14 Evo',
      price: 249999,
      category: 'Profesionales',
      type: 'notebook',
      images: [
        'images/Notebook/notebook7.png',
        'images/Notebook/notebook07.png',
        'images/Notebook/notebook007.png',
        'images/Notebook/notebook0007.png'
      ],
      description: 'MSI Prestige 14 Evo ultraligera con gran autonomía y 256GB SSD.',
      specifications: {
        'Procesador': 'Apple M2 / Intel Evo equivalente',
        'Memoria RAM': '8GB',
        'Almacenamiento': '256GB SSD',
        'Pantalla': '14" Full HD / QHD (según variante)',
        'Tarjeta Gráfica': 'Integrada',
        'Sistema Operativo': 'Windows 11 / equivalente',
        'Conectividad': 'Wi-Fi 6, Bluetooth 5',
        'Puertos': 'Thunderbolt/USB-C, USB-A, Jack 3.5mm',
        'Batería': 'Hasta 18 horas',
        'Peso': '≈1.2–1.3 kg',
        'Dimensiones': 'Compactas',
        'Garantía': '1 año'
      },
      badges: ['premium', 'flagship'],
      rating: 4.8,
      reviews: 67,
      stock: 4
    },

    notebook8: {
      id: 'notebook8',
      title: 'MSI Prestige 13 Evo',
      brand: 'MSI',
      model: 'Prestige 13 Evo',
      price: 134999,
      category: 'Profesionales',
      type: 'notebook',
      images: [
        'images/Notebook/notebook8.png',
        'images/Notebook/notebook08.png',
        'images/Notebook/notebook008.png',
        'images/Notebook/notebook0008.png'
      ],
      description: 'MSI Prestige 13 Evo ultraligera con i5-1135G7, 8GB RAM y 256GB SSD.',
      specifications: {
        'Procesador': 'Intel Core i5-1135G7 (hasta 4.2GHz)',
        'Memoria RAM': '8GB LPDDR4X',
        'Almacenamiento': '256GB SSD NVMe',
        'Pantalla': '13.3" (1920x1080) alta calidad',
        'Tarjeta Gráfica': 'Intel Iris Xe',
        'Sistema Operativo': 'Windows 11 Home',
        'Conectividad': 'Wi-Fi 6E, Bluetooth 5.1',
        'Puertos': '2x Thunderbolt 4, 1x USB-A, microSD',
        'Batería': 'Hasta 20 horas',
        'Peso': '0.87 kg',
        'Dimensiones': 'Compactas',
        'Garantía': '2 años'
      },
      badges: ['premium', 'new'],
      rating: 4.4,
      reviews: 112,
      stock: 9
    },

    notebook9: {
      id: 'notebook9',
      title: 'MSI Summit E13 Flip Evo',
      brand: 'MSI',
      model: 'Summit E13 Flip Evo',
      price: 119999,
      category: 'Uso Diario',
      type: 'notebook',
      images: [
        'images/Notebook/notebook9.png',
        'images/Notebook/notebook09.png',
        'images/Notebook/notebook009.png',
        'images/Notebook/notebook0009.png'
      ],
      description: 'MSI Summit E13 Flip Evo 2-en-1 con Ryzen 5 5500U, 16GB RAM y 512GB SSD.',
      specifications: {
        'Procesador': 'AMD Ryzen 5 5500U (hasta 4.0GHz)',
        'Memoria RAM': '16GB DDR4-3200MHz',
        'Almacenamiento': '512GB SSD NVMe',
        'Pantalla': '13" táctil convertible 360°',
        'Tarjeta Gráfica': 'Integrada',
        'Sistema Operativo': 'Windows 11 Home',
        'Conectividad': 'Wi-Fi 6, Bluetooth 5.2',
        'Puertos': 'USB-A, USB-C 3.2, HDMI 2.0, microSD',
        'Batería': 'Hasta 11 horas',
        'Peso': 'Ligera',
        'Dimensiones': 'Compactas',
        'Garantía': '2 años'
      },
      badges: ['popular', 'value'],
      rating: 4.3,
      reviews: 145,
      stock: 11
    },

    notebook10: {
      id: 'notebook10',
      title: 'MSI Pulse 15',
      brand: 'MSI',
      model: 'Pulse 15',
      price: 199999,
      category: 'Gaming',
      type: 'notebook',
      images: [
        'images/Notebook/notebook10.png',
        'images/Notebook/notebook010.png',
        'images/Notebook/notebook0010.png',
        'images/Notebook/notebook00010.png'
      ],
      description: 'MSI Pulse 15 gaming: Ryzen 7 5800H, 16GB RAM, 1TB SSD y RTX 3060 (165Hz).',
      specifications: {
        'Procesador': 'AMD Ryzen 7 5800H (hasta 4.4GHz)',
        'Memoria RAM': '16GB DDR4-3200MHz (expandible a 32GB)',
        'Almacenamiento': '1TB SSD NVMe',
        'Pantalla': '15.6" Full HD IPS 165Hz G-Sync',
        'Tarjeta Gráfica': 'NVIDIA GeForce RTX 3060 6GB',
        'Sistema Operativo': 'Windows 11 Home',
        'Conectividad': 'Wi-Fi 6E, Bluetooth 5.1, Ethernet',
        'Puertos': '4x USB-A, 1x USB-C, HDMI 2.1, RJ-45',
        'Batería': '4–8 horas',
        'Peso': '≈2.4 kg',
        'Dimensiones': 'Acorde al modelo',
        'Garantía': '3 años'
      },
      badges: ['gaming', 'premium', 'flagship'],
      rating: 4.7,
      reviews: 73,
      stock: 5
    }
  },

  monitors: {
    monitor1: {
      id: 'monitor1',
      title: 'MSI Optix G27C7 27" 240Hz QHD Curvo',
      brand: 'MSI',
      model: 'Optix G27C7',
      price: 89999,
      category: 'Gaming',
      type: 'monitor',
      images: [
        'images/Monitores/monitor1.png',
        'images/Monitores/monitor01.png',
        'images/Monitores/monitor001.png',
        'images/Monitores/monitor0001.png'
      ],
      description: 'MSI Optix G27C7 curvo 27" QHD 240Hz y 1ms, ideal para eSports.',
      specifications: {
        'Tamaño': '27 pulgadas',
        'Resolución': '2560x1440 (QHD)',
        'Frecuencia': '240Hz',
        'Panel': 'VA curvo',
        'Tiempo de respuesta': '1ms (MPRT)',
        'Conectividad': 'HDMI, DP, USB',
        'Ajustes': 'Altura, inclinación, giro',
        'Compatibilidad': 'FreeSync / G-Sync compatible'
      },
      badges: ['gaming', 'curved', 'popular'],
      rating: 4.5,
      reviews: 156,
      stock: 12
    },
    monitor2: {
      id: 'monitor2',
      title: 'MSI Optix MAG342CQR 34" 75Hz IPS USB-C Curvo',
      brand: 'MSI',
      model: 'Optix MAG342CQR',
      price: 124999,
      category: 'Oficina',
      type: 'monitor',
      images: [
        'images/Monitores/monitor2.png',
        'images/Monitores/monitor02.png',
        'images/Monitores/monitor002.png',
        'images/Monitores/monitor0002.png'
      ],
      description: 'MSI Optix MAG342CQR 34" ultrawide curvo IPS 75Hz con USB-C.',
      specifications: {
        'Tamaño': '34 pulgadas',
        'Resolución': '3440x1440 (UWQHD)',
        'Frecuencia': '75Hz',
        'Panel': 'IPS curvo',
        'Tiempo de respuesta': '5ms',
        'Conectividad': 'USB-C (PD), HDMI, DP, USB',
        'Ajustes': 'Altura, inclinación',
        'Extras': 'Ultrawide 21:9'
      },
      badges: ['ultrawide', 'curved', 'oficina', 'value'],
      rating: 4.3,
      reviews: 203,
      stock: 18
    },
    monitor3: {
      id: 'monitor3',
      title: 'MSI Optix PG27C 27" 165Hz Curvo G-Sync Compatible',
      brand: 'MSI',
      model: 'Optix PG27C',
      price: 149999,
      category: 'Gaming',
      type: 'monitor',
      images: [
        'images/Monitores/monitor3.png',
        'images/Monitores/monitor03.png',
        'images/Monitores/monitor003.png',
        'images/Monitores/monitor0003.png'
      ],
      description: 'MSI Optix PG27C 27" 165Hz curvo, IPS y G-Sync Compatible.',
      specifications: {
        'Tamaño': '27 pulgadas',
        'Resolución': '2560x1440 (QHD)',
        'Frecuencia': '165Hz',
        'Panel': 'IPS curvo',
        'Tiempo de respuesta': '4ms (GtG)',
        'Conectividad': 'HDMI, DP, USB',
        'Ajustes': 'Altura, inclinación, giro, pivot'
      },
      badges: ['gaming', 'premium', 'flagship', 'curved'],
      rating: 4.7,
      reviews: 89,
      stock: 7
    },
    monitor4: {
      id: 'monitor4',
      title: 'MSI Modern MD272Q 27" 4K IPS USB-C',
      brand: 'MSI',
      model: 'Modern MD272Q',
      price: 179999,
      category: '4K',
      type: 'monitor',
      images: [
        'images/Monitores/monitor4.png',
        'images/Monitores/monitor04.png',
        'images/Monitores/monitor004.png',
        'images/Monitores/monitor0004.png'
      ],
      description: 'MSI Modern MD272Q 27" 4K IPS con hub USB-C para productividad.',
      specifications: {
        'Tamaño': '27 pulgadas',
        'Resolución': '3840x2160 (4K UHD)',
        'Frecuencia': '60Hz',
        'Panel': 'IPS',
        'Tiempo de respuesta': '5–8ms',
        'Conectividad': 'USB-C (PD), HDMI, DP, USB',
        'Ajustes': 'Altura, inclinación, giro, pivot'
      },
      badges: ['4k', 'premium', 'oficina'],
      rating: 4.6,
      reviews: 134,
      stock: 9
    },
    monitor5: {
      id: 'monitor5',
      title: 'MSI G24C4 24" 144Hz IPS Gaming Curvo',
      brand: 'MSI',
      model: 'G24C4',
      price: 64999,
      category: 'Gaming',
      type: 'monitor',
      images: [
        'images/Monitores/monitor5.png',
        'images/Monitores/monitor05.png',
        'images/Monitores/monitor005.png',
        'images/Monitores/monitor0005.png'
      ],
      description: 'MSI G24C4 24" Full HD 144Hz curvo con 1ms para gaming.',
      specifications: {
        'Tamaño': '24 pulgadas',
        'Resolución': '1920x1080 (Full HD)',
        'Frecuencia': '144Hz',
        'Panel': 'IPS curvo',
        'Tiempo de respuesta': '1ms (MPRT)',
        'Conectividad': 'HDMI, DP, USB',
        'Ajustes': 'Altura, inclinación'
      },
      badges: ['gaming', 'curved', 'value', 'popular'],
      rating: 4.2,
      reviews: 287,
      stock: 22
    },
    monitor6: {
      id: 'monitor6',
      title: 'MSI Creator PS321URV 32" 4K Professional IPS',
      brand: 'MSI',
      model: 'Creator PS321URV',
      price: 199999,
      category: '4K',
      type: 'monitor',
      images: [
        'images/Monitores/monitor6.png',
        'images/Monitores/monitor06.png',
        'images/Monitores/monitor006.png',
        'images/Monitores/monitor0006.png'
      ],
      description: 'MSI Creator PS321URV 32" 4K IPS para diseño con color preciso.',
      specifications: {
        'Tamaño': '32 pulgadas',
        'Resolución': '3840x2160 (4K UHD)',
        'Frecuencia': '60Hz',
        'Panel': 'IPS',
        'Tiempo de respuesta': '4ms (GtG)',
        'Conectividad': 'HDMI, DP, USB',
        'Ajustes': 'Altura, inclinación, giro, pivot'
      },
      badges: ['4k', 'premium', 'flagship'],
      rating: 4.8,
      reviews: 67,
      stock: 5
    },
    monitor7: {
      id: 'monitor7',
      title: 'MSI Optix MAG341CQ 34" Ultrawide Curvo',
      brand: 'MSI',
      model: 'Optix MAG341CQ',
      price: 134999,
      category: 'Curvos',
      type: 'monitor',
      images: [
        'images/Monitores/monitor7.png',
        'images/Monitores/monitor07.png',
        'images/Monitores/monitor007.png',
        'images/Monitores/monitor0007.png'
      ],
      description: 'MSI Optix MAG341CQ 34" UWQHD 100Hz curvo para inmersión total.',
      specifications: {
        'Tamaño': '34 pulgadas',
        'Resolución': '3440x1440 (UWQHD)',
        'Frecuencia': '100Hz',
        'Panel': 'VA curvo (1500R)',
        'Tiempo de respuesta': '1ms (MPRT)',
        'Conectividad': 'HDMI, DP, USB',
        'Ajustes': 'Altura, inclinación'
      },
      badges: ['curved', 'ultrawide', 'gaming'],
      rating: 4.4,
      reviews: 123,
      stock: 8
    },
    monitor8: {
      id: 'monitor8',
      title: 'MSI PRO MP241C 24" Empresarial IPS Curvo',
      brand: 'MSI',
      model: 'PRO MP241C',
      price: 54999,
      category: 'Oficina',
      type: 'monitor',
      images: [
        'images/Monitores/monitor8.png',
        'images/Monitores/monitor08.png',
        'images/Monitores/monitor008.png',
        'images/Monitores/monitor0008.png'
      ],
      description: 'MSI PRO MP241C 24" Full HD IPS curvo con ergonomía para oficina.',
      specifications: {
        'Tamaño': '24 pulgadas',
        'Resolución': '1920x1080 (Full HD)',
        'Frecuencia': '60Hz',
        'Panel': 'IPS curvo',
        'Tiempo de respuesta': '5ms (GtG)',
        'Conectividad': 'HDMI, DP, VGA, USB',
        'Ajustes': 'Altura, inclinación, giro, pivot'
      },
      badges: ['oficina', 'value', 'curved'],
      rating: 4.1,
      reviews: 198,
      stock: 30
    },
    monitor9: {
      id: 'monitor9',
      title: 'MSI G27CQ4 27" 170Hz QHD KVM Curvo',
      brand: 'MSI',
      model: 'G27CQ4',
      price: 94999,
      category: 'Gaming',
      type: 'monitor',
      images: [
        'images/Monitores/monitor9.png',
        'images/Monitores/monitor09.png',
        'images/Monitores/monitor009.png',
        'images/Monitores/monitor0009.png'
      ],
      description: 'MSI G27CQ4 27" QHD 170Hz IPS curvo con KVM integrado.',
      specifications: {
        'Tamaño': '27 pulgadas',
        'Resolución': '2560x1440 (QHD)',
        'Frecuencia': '170Hz',
        'Panel': 'IPS curvo',
        'Tiempo de respuesta': '1ms (MPRT)',
        'Conectividad': 'HDMI, DP, USB, USB-C',
        'Ajustes': 'Altura, inclinación'
      },
      badges: ['gaming', 'value', 'popular', 'curved'],
      rating: 4.4,
      reviews: 167,
      stock: 14
    },
    monitor10: {
      id: 'monitor10',
      title: 'MSI Modern MD271QP 27" 4K IPS Entry',
      brand: 'MSI',
      model: 'Modern MD271QP',
      price: 89999,
      category: '4K',
      type: 'monitor',
      images: [
        'images/Monitores/monitor10.png',
        'images/Monitores/monitor010.png',
        'images/Monitores/monitor0010.png',
        'images/Monitores/monitor00010.png'
      ],
      description: 'MSI Modern MD271QP 27" 4K IPS con biseles finos. Opción 4K accesible.',
      specifications: {
        'Tamaño': '27 pulgadas',
        'Resolución': '3840x2160 (4K UHD)',
        'Frecuencia': '60Hz',
        'Panel': 'IPS',
        'Tiempo de respuesta': '4ms (GtG)',
        'Conectividad': 'HDMI, DP',
        'Ajustes': 'Inclinación'
      },
      badges: ['4k', 'value'],
      rating: 4.0,
      reviews: 145,
      stock: 16
    }
  }
};

function getAllProducts() {
  return { ...PRODUCTOS_DB.notebooks, ...PRODUCTOS_DB.monitors };
}
function getProductById(id) {
  const all = getAllProducts();
  return all[id] || null;
}
function getProductsByCategory(category) {
  const all = getAllProducts();
  return Object.values(all).filter(p => (p.category || '').toLowerCase() === String(category).toLowerCase());
}
function getProductsByType(type) {
  if (type === 'notebook') return Object.values(PRODUCTOS_DB.notebooks);
  if (type === 'monitor') return Object.values(PRODUCTOS_DB.monitors);
  return [];
}
function searchProducts(query) {
  const all = getAllProducts();
  const q = String(query).toLowerCase();
  return Object.values(all).filter(p =>
    (p.title || '').toLowerCase().includes(q) ||
    (p.brand || '').toLowerCase().includes(q) ||
    (p.category || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q)
  );
}
