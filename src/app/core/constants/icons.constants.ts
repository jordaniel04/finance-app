export const MATERIAL_ICONS = {
    FINANZAS: [
        'account_balance',
        'attach_money',
        'credit_card',
        'savings',
        'payments',
        'currency_exchange'
    ],
    TRANSPORTE: [
        'local_taxi',
        'directions_car',
        'flight',
        'directions_bus',
        'two_wheeler',
        'train'
    ],
    COMPRAS: [
        'shopping_cart',
        'shopping_bag',
        'store',
        'local_mall',
        'redeem'
    ],
    ESTILO_DE_VIDA: [
        'restaurant',
        'movie',
        'fitness_center',
        'school',
        'local_hospital',
        'sports_esports',
        'sports_basketball',
        'local_bar',
        'book',
        'library_books',
        'menu_book',
        'auto_stories',
        'bookmark'
    ],
    HOGAR: [
        'home',
        'cleaning_services',
        'power',
        'wifi',
        'water_drop',
        'electric_bolt'
    ],
    TRABAJO: [
        'work',
        'business_center',
        'computer',
        'phone',
        'smartphone',
        'print',
        'build'
    ]
} as const;

export const ALL_ICONS = Object.values(MATERIAL_ICONS).flat();

export const CATEGORY_COLORS = {
    INCOME: [
        '#4CAF50', // Verde
        '#8BC34A', // Verde claro
        '#009688', // Teal
        '#00BCD4', // Cyan
        '#03A9F4', // Azul claro
        '#2196F3'  // Azul
    ],
    EXPENSE: [
        '#F44336', // Rojo
        '#E91E63', // Rosa
        '#9C27B0', // Púrpura
        '#673AB7', // Morado profundo
        '#FF5722', // Naranja profundo
        '#FF9800'  // Naranja
    ]
} as const;
