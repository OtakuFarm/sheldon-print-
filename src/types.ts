export interface PrintItem {
  id: string;
  title: string;
  price: number;
  formattedPrice: string;
  category: 'Prints' | 'Posters' | 'Editions';
  description: string;
  dimensions: string[];
  selectedDimension: string;
  medium: string;
  paper: string;
  inStock: boolean;
  soldOutLabel?: string;
  image: string;
  filmStock: string;
  year: string;
  tags: string[];
}

export interface CartItem {
  product: PrintItem;
  quantity: number;
  selectedDimension: string;
  frameOption: 'Unframed' | 'Matte Black Gallery Frame' | 'Natural Oak Frame';
  framePrice: number;
}

export type PaymentMethodId = 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'klarna';

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderRecord {
  orderId: string;
  date: string;
  shippingDetails: ShippingDetails;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethodId;
  paymentMethodName: string;
  trackingNumber: string;
  estimatedDelivery: string;
  emailNotificationSent: boolean;
  notificationTimestamp: string;
}
