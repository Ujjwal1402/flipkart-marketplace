/**
 * Realistic Flipkart-Style E-Commerce Seed Catalog
 */
import { Product, Category, User, Seller } from '../schema/models';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-mobiles',
    name: 'Mobiles',
    slug: 'mobiles',
    iconName: 'Smartphone',
    bannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    subcategories: ['Flagship Phones', '5G Mobiles', 'Budget Smartphones', 'Mobile Accessories', 'Tablets']
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    iconName: 'Laptop',
    bannerImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
    subcategories: ['Laptops', 'Headphones & Audio', 'Smart Watches', 'Cameras', 'Gaming Consoles']
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    iconName: 'Shirt',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    subcategories: ['Men T-Shirts', 'Women Ethnic Wear', 'Sneakers & Shoes', 'Watches & Bags', 'Winter Wear']
  },
  {
    id: 'cat-appliances',
    name: 'Appliances',
    slug: 'appliances',
    iconName: 'Tv',
    bannerImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
    subcategories: ['Smart Televisions', 'Air Conditioners', 'Refrigerators', 'Washing Machines', 'Microwaves']
  },
  {
    id: 'cat-home',
    name: 'Home & Furniture',
    slug: 'home',
    iconName: 'Armchair',
    bannerImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    subcategories: ['Sofas & Couches', 'Beds & Mattresses', 'Office Chairs', 'Decor & Lighting', 'Kitchenware']
  },
  {
    id: 'cat-grocery',
    name: 'Grocery',
    slug: 'grocery',
    iconName: 'ShoppingBag',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
    subcategories: ['Dry Fruits & Nuts', 'Cooking Oil & Ghee', 'Snacks & Beverages', 'Spices', 'Organic Essentials']
  }
];

export const SEED_SELLERS: Seller[] = [
  {
    id: 'seller-retailnet',
    businessName: 'RetailNet Pvt Ltd',
    ownerName: 'Sunil Mittal',
    gstin: '29ABCDE1234F1Z5',
    email: 'contact@retailnet.in',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalSalesCount: 142050,
    totalRevenue: 289450000,
    joinedAt: '2023-01-15T00:00:00.000Z',
    verified: true
  },
  {
    id: 'seller-supercom',
    businessName: 'SuperComNet Tech India',
    ownerName: 'Pooja Agarwal',
    gstin: '07AAACS1429B1ZX',
    email: 'support@supercomnet.com',
    phone: '+91 98111 22334',
    rating: 4.6,
    totalSalesCount: 98300,
    totalRevenue: 178200000,
    joinedAt: '2023-04-10T00:00:00.000Z',
    verified: true
  },
  {
    id: 'seller-indifash',
    businessName: 'IndiFashion Trendsetters',
    ownerName: 'Arjun Verma',
    gstin: '27AABCT2841M1ZY',
    email: 'orders@indifash.com',
    phone: '+91 99200 44556',
    rating: 4.5,
    totalSalesCount: 65400,
    totalRevenue: 43200000,
    joinedAt: '2023-07-22T00:00:00.000Z',
    verified: true
  }
];

export const DEFAULT_BANK_OFFERS = [
  {
    id: 'bo-1',
    bankName: 'Flipkart Axis Bank',
    discountDescription: '5% Unlimited Cashback on Flipkart Axis Bank Credit Card',
    terms: 'T&C Apply'
  },
  {
    id: 'bo-2',
    bankName: 'HDFC Bank',
    discountDescription: '10% Instant Discount up to ₹1,500 on HDFC Bank Credit Card Non-EMI Txns',
    terms: 'Min order value ₹4,999'
  },
  {
    id: 'bo-3',
    bankName: 'ICICI Bank',
    discountDescription: '₹1,000 Off On ICICI Bank Credit Card EMI Transactions',
    terms: 'On 6-month & above tenure'
  },
  {
    id: 'bo-4',
    bankName: 'Special Partner Offer',
    discountDescription: 'Get extra ₹2,000 off on Exchange with your old device',
    terms: 'Applicable on select models'
  }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-iphone15',
    title: 'Apple iPhone 15 (Black, 128 GB)',
    subtitle: 'A16 Bionic Chip | Dynamic Island | 48MP Main Camera',
    brand: 'Apple',
    category: 'mobiles',
    subCategory: 'Flagship Phones',
    price: 64999,
    mrp: 79900,
    discountPercent: 18,
    rating: 4.7,
    ratingsCount: 142580,
    reviewsCount: 8940,
    isFAssured: true,
    inStock: true,
    stockQuantity: 45,
    sellerId: 'seller-retailnet',
    sellerName: 'RetailNet Pvt Ltd',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    highlights: [
      '128 GB ROM',
      '15.49 cm (6.1 inch) Super Retina XDR Display',
      '48MP + 12MP Dual Rear Camera | 12MP Front Camera',
      'A16 Bionic Chip, 6 Core Processor',
      'Ceramic Shield Front | USB Type-C Port'
    ],
    specifications: [
      {
        category: 'General',
        items: [
          { key: 'In The Box', value: 'Handset, USB-C Charge Cable (1m), Documentation' },
          { key: 'Model Number', value: 'MTP03HN/A' },
          { key: 'Color', value: 'Black' },
          { key: 'SIM Type', value: 'Dual SIM (Nano + eSIM)' }
        ]
      },
      {
        category: 'Display Features',
        items: [
          { key: 'Display Size', value: '15.49 cm (6.1 inch)' },
          { key: 'Resolution', value: '2556 x 1179 Pixels Super Retina XDR' },
          { key: 'Peak Brightness', value: '2000 nits Outdoors' }
        ]
      },
      {
        category: 'Battery & Power',
        items: [
          { key: 'Battery Type', value: 'Lithium Ion' },
          { key: 'Fast Charging', value: 'Up to 50% charge in 30 mins with 20W adapter' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: '1 Year Brand Warranty for Phone and 6 Months for In-Box Accessories',
    deliveryDays: 1,
    superCoinsEarnable: 100,
    featured: true,
    dealOfTheDay: true,
    tags: ['iphone', 'apple', 'smartphone', '5g', 'best-seller'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'prod-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    subtitle: 'Galaxy AI is Here | Snapdragon 8 Gen 3 | 200MP Quad Camera',
    brand: 'Samsung',
    category: 'mobiles',
    subCategory: 'Flagship Phones',
    price: 119999,
    mrp: 134999,
    discountPercent: 11,
    rating: 4.8,
    ratingsCount: 38400,
    reviewsCount: 3410,
    isFAssured: true,
    inStock: true,
    stockQuantity: 28,
    sellerId: 'seller-retailnet',
    sellerName: 'RetailNet Pvt Ltd',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
    highlights: [
      '12 GB RAM | 256 GB ROM',
      '17.27 cm (6.8 inch) Quad HD+ Dynamic AMOLED 2X Display',
      '200MP + 50MP + 12MP + 10MP | 12MP Front Camera',
      '5000 mAh Lithium-ion Battery with 45W Fast Charging',
      'Snapdragon 8 Gen 3 Processor with Titanium Frame & Built-in S-Pen'
    ],
    specifications: [
      {
        category: 'General',
        items: [
          { key: 'In The Box', value: 'Handset, S-Pen, Data Cable (Type-C to Type-C), Ejection Pin' },
          { key: 'Model Name', value: 'Galaxy S24 Ultra' },
          { key: 'Processor', value: 'Qualcomm Snapdragon 8 Gen 3' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: '1 Year Manufacturer Warranty for Device',
    deliveryDays: 1,
    superCoinsEarnable: 150,
    featured: true,
    dealOfTheDay: false,
    tags: ['samsung', 'flagship', 'galaxy-ai', 'spen', '200mp'],
    createdAt: '2024-02-10T00:00:00.000Z'
  },
  {
    id: 'prod-macbook-air-m3',
    title: 'Apple MacBook Air M3 (16 GB Unified / 512 GB SSD / Space Grey)',
    subtitle: 'Liquid Retina Display | MagSafe 3 | Up to 18 Hours Battery',
    brand: 'Apple',
    category: 'electronics',
    subCategory: 'Laptops',
    price: 124900,
    mrp: 134900,
    discountPercent: 7,
    rating: 4.9,
    ratingsCount: 12850,
    reviewsCount: 920,
    isFAssured: true,
    inStock: true,
    stockQuantity: 19,
    sellerId: 'seller-retailnet',
    sellerName: 'RetailNet Pvt Ltd',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    highlights: [
      'Apple M3 8-core CPU with 10-core GPU',
      '16 GB Unified Memory | 512 GB Superfast SSD',
      '34.54 cm (13.6 inch) Liquid Retina Display with True Tone',
      '1080p FaceTime HD Camera & 3-Mic Array',
      'Backlit Magic Keyboard with Touch ID'
    ],
    specifications: [
      {
        category: 'Processor & Memory',
        items: [
          { key: 'Dedicated Graphic Processor', value: '10-Core Apple GPU' },
          { key: 'RAM', value: '16 GB Unified' },
          { key: 'SSD Capacity', value: '512 GB' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: '1 Year Apple International Warranty',
    deliveryDays: 2,
    superCoinsEarnable: 200,
    featured: true,
    dealOfTheDay: true,
    tags: ['macbook', 'apple', 'm3', 'laptop', 'thin-light'],
    createdAt: '2024-03-05T00:00:00.000Z'
  },
  {
    id: 'prod-sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones (Silver)',
    subtitle: 'Industry-Leading Noise Cancellation | 30 Hrs Battery | Multipoint Connect',
    brand: 'Sony',
    category: 'electronics',
    subCategory: 'Headphones & Audio',
    price: 26990,
    mrp: 34990,
    discountPercent: 22,
    rating: 4.6,
    ratingsCount: 22400,
    reviewsCount: 3100,
    isFAssured: true,
    inStock: true,
    stockQuantity: 62,
    sellerId: 'seller-supercom',
    sellerName: 'SuperComNet Tech India',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    highlights: [
      'With Mic: Yes | Bluetooth Version: 5.2',
      'Industry-leading Active Noise Cancellation with Auto NC Optimizer',
      'Crystal Clear Hands-Free Calling with 4 Beamforming Microphones',
      'Up to 30 Hours Battery Life with Quick Charge (3 mins = 3 hours)'
    ],
    specifications: [
      {
        category: 'Sound Features',
        items: [
          { key: 'Driver Type', value: '30mm Carbon Fiber Driver Unit' },
          { key: 'Frequency Response', value: '4 Hz - 40,000 Hz (Hi-Res Audio LDAC)' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: '1 Year Brand Warranty',
    deliveryDays: 1,
    superCoinsEarnable: 50,
    featured: true,
    dealOfTheDay: true,
    tags: ['sony', 'anc', 'headphones', 'wireless', 'music'],
    createdAt: '2024-02-15T00:00:00.000Z'
  },
  {
    id: 'prod-nike-airmax',
    title: "Nike Air Max SC Running & Lifestyle Shoes for Men",
    subtitle: 'Max Air Cushioning | Heritage Leather & Mesh Upper',
    brand: 'Nike',
    category: 'fashion',
    subCategory: 'Sneakers & Shoes',
    price: 4799,
    mrp: 7495,
    discountPercent: 36,
    rating: 4.4,
    ratingsCount: 45300,
    reviewsCount: 3200,
    isFAssured: true,
    inStock: true,
    stockQuantity: 90,
    sellerId: 'seller-indifash',
    sellerName: 'IndiFashion Trendsetters',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    highlights: [
      'Upper Material: Mesh and Premium Synthetic Leather',
      'Sole: Durable Rubber with Waffle Traction',
      'Visible Air-Sole Unit for Lightweight Impact Cushioning',
      'Classic 90s Track Heritage Design'
    ],
    specifications: [
      {
        category: 'General',
        items: [
          { key: 'Occasion', value: 'Sports, Casual & Athleisure' },
          { key: 'Closure', value: 'Lace-Ups' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: '3 Months Manufacturing Warranty',
    deliveryDays: 2,
    superCoinsEarnable: 20,
    featured: false,
    dealOfTheDay: true,
    tags: ['nike', 'shoes', 'sneakers', 'fashion', 'men'],
    createdAt: '2024-03-01T00:00:00.000Z'
  },
  {
    id: 'prod-lg-oled-55',
    title: 'LG 139 cm (55 inch) OLED 4K Ultra HD Smart WebOS TV (OLED55C3)',
    subtitle: 'α9 AI Processor Gen6 | Dolby Vision & Atmos | 120Hz Gaming',
    brand: 'LG',
    category: 'appliances',
    subCategory: 'Smart Televisions',
    price: 94990,
    mrp: 169990,
    discountPercent: 44,
    rating: 4.7,
    ratingsCount: 9400,
    reviewsCount: 1100,
    isFAssured: true,
    inStock: true,
    stockQuantity: 15,
    sellerId: 'seller-retailnet',
    sellerName: 'RetailNet Pvt Ltd',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80',
    highlights: [
      'Self-Lit OLED Pixels with Infinite Contrast & 100% Color Fidelity',
      'WebOS with Hands-Free Voice Recognition & Magic Remote',
      '4 x HDMI 2.1 Ports with G-Sync & FreeSync for Pro Gaming',
      '40W 2.2 Channel Dolby Atmos Speaker System'
    ],
    specifications: [
      {
        category: 'Display',
        items: [
          { key: 'Display Type', value: '4K OLED Display' },
          { key: 'Refresh Rate', value: '120 Hz' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: '3 Years Comprehensive Warranty from LG India',
    deliveryDays: 2,
    superCoinsEarnable: 150,
    featured: true,
    dealOfTheDay: false,
    tags: ['lg', 'tv', 'oled', 'smart-tv', 'home-theater'],
    createdAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: 'prod-ergonomic-chair',
    title: 'Green Soul Monster Ultimate High-Back Ergonomic Gaming & Office Chair',
    subtitle: 'Spimodal Memory Foam Lumbar Support | 4D Armrests | 180° Recline',
    brand: 'Green Soul',
    category: 'home',
    subCategory: 'Office Chairs',
    price: 16990,
    mrp: 29990,
    discountPercent: 43,
    rating: 4.5,
    ratingsCount: 18700,
    reviewsCount: 2840,
    isFAssured: true,
    inStock: true,
    stockQuantity: 34,
    sellerId: 'seller-supercom',
    sellerName: 'SuperComNet Tech India',
    images: [
      'https://images.unsplash.com/photo-1580481077194-436f56e92f23?w=800&q=80',
      'https://images.unsplash.com/photo-1589384267710-7a25501869e9?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1580481077194-436f56e92f23?w=600&q=80',
    highlights: [
      'Breathable Soft-Spun Fabric Upholstery',
      'Heavy Duty Class 4 Gas Lift & Heavy Metal Base',
      '3-Year Manufacturer Warranty on Internal Mechanisms'
    ],
    specifications: [
      {
        category: 'Dimensions',
        items: [
          { key: 'Max Weight Capacity', value: '135 kg' },
          { key: 'Recline Angle', value: '90° to 180°' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: '3 Years On-Site Warranty',
    deliveryDays: 3,
    superCoinsEarnable: 30,
    featured: false,
    dealOfTheDay: false,
    tags: ['chair', 'furniture', 'office', 'ergonomic', 'gaming'],
    createdAt: '2024-02-18T00:00:00.000Z'
  },
  {
    id: 'prod-almonds-nuts',
    title: 'Happilo Premium California Jumbo Almonds (1 kg Value Pack)',
    subtitle: '100% Natural | Rich in Protein, Fiber & Antioxidants | Gluten-Free',
    brand: 'Happilo',
    category: 'grocery',
    subCategory: 'Dry Fruits & Nuts',
    price: 849,
    mrp: 1499,
    discountPercent: 43,
    rating: 4.6,
    ratingsCount: 88900,
    reviewsCount: 9400,
    isFAssured: true,
    inStock: true,
    stockQuantity: 210,
    sellerId: 'seller-retailnet',
    sellerName: 'RetailNet Pvt Ltd',
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80',
    highlights: [
      'Quantity: 1000g (Pack of 1)',
      'Vacuum packed for maximum crunch and freshness',
      'Zero cholesterol, high healthy fats for heart health'
    ],
    specifications: [
      {
        category: 'Nutritional Value',
        items: [
          { key: 'Country of Origin', value: 'USA (Packed in India)' },
          { key: 'Dietary Preference', value: 'Vegetarian, Vegan, Gluten-Free' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: 'Best before 9 months from packaging',
    deliveryDays: 1,
    superCoinsEarnable: 10,
    featured: false,
    dealOfTheDay: true,
    tags: ['grocery', 'nuts', 'healthy', 'almonds', 'dryfruits'],
    createdAt: '2024-03-10T00:00:00.000Z'
  },
  {
    id: 'prod-oneplus-12r',
    title: 'OnePlus 12R 5G (Cool Blue, 16GB RAM + 256GB Storage)',
    subtitle: 'Snapdragon 8 Gen 2 | 5500 mAh Battery | 100W SUPERVOOC Charging',
    brand: 'OnePlus',
    category: 'mobiles',
    subCategory: '5G Mobiles',
    price: 42999,
    mrp: 45999,
    discountPercent: 6,
    rating: 4.6,
    ratingsCount: 51200,
    reviewsCount: 4280,
    isFAssured: true,
    inStock: true,
    stockQuantity: 55,
    sellerId: 'seller-supercom',
    sellerName: 'SuperComNet Tech India',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    highlights: [
      '16 GB RAM | 256 GB ROM',
      '17.22 cm (6.78 inch) 120 Hz ProXDR AMOLED Display',
      '50MP Sony IMX890 Camera with OIS',
      '5500 mAh Battery with 100W SUPERVOOC Charger in Box'
    ],
    specifications: [
      {
        category: 'Performance',
        items: [
          { key: 'Processor', value: 'Qualcomm Snapdragon 8 Gen 2' },
          { key: 'Operating System', value: 'OxygenOS based on Android 14' }
        ]
      }
    ],
    bankOffers: DEFAULT_BANK_OFFERS,
    warranty: '1 Year Brand Warranty',
    deliveryDays: 1,
    superCoinsEarnable: 80,
    featured: true,
    dealOfTheDay: false,
    tags: ['oneplus', '5g', 'fast-charging', 'amoled', 'supervooc'],
    createdAt: '2024-02-28T00:00:00.000Z'
  }
];

export const SEED_USER: User = {
  id: 'usr-default',
  name: 'Ujjwal Sharma',
  email: 'ujjwal14022003@gmail.com',
  phone: '+91 98765 00140',
  role: 'customer',
  passwordHash: 'Customer@123',
  superCoins: 480,
  isPlusMember: true,
  addresses: [
    {
      id: 'addr-home',
      name: 'Ujjwal Sharma',
      phone: '9876500140',
      pincode: '560103',
      locality: 'Outer Ring Road, Bellandur',
      addressLine: 'Flat 402, Prestige Tech Vista, Green Glen Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Near Central Mall',
      addressType: 'HOME',
      isDefault: true
    },
    {
      id: 'addr-work',
      name: 'Ujjwal Sharma',
      phone: '9876500140',
      pincode: '560066',
      locality: 'Whitefield',
      addressLine: 'Tower B, 7th Floor, Global Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Opposite Metro Station',
      addressType: 'WORK',
      isDefault: false
    }
  ],
  createdAt: '2023-01-01T00:00:00.000Z'
};

export const SEED_ADMIN: User = {
  id: 'usr-admin',
  name: 'Flipkart Enterprise Admin',
  email: 'admin@flipkart.com',
  phone: '+91 99999 88888',
  role: 'admin',
  passwordHash: 'Admin@123',
  superCoins: 9999,
  isPlusMember: true,
  addresses: [
    {
      id: 'addr-hq',
      name: 'Flipkart HQ Operations',
      phone: '9999988888',
      pincode: '560103',
      locality: 'Embassy Tech Village',
      addressLine: 'Devarabisanahalli, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Near Cessna Business Park',
      addressType: 'WORK',
      isDefault: true
    }
  ],
  createdAt: '2022-01-01T00:00:00.000Z'
};
