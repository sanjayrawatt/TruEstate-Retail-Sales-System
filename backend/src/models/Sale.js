import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    transactionId: String,
    date: Date,

    customerId: String,
    customerName: String,
    phoneNumber: String,
    gender: String,
    age: Number,
    customerRegion: String,
    customerType: String,

    productId: String,
    productName: String,
    brand: String,
    productCategory: String,
    tags: [String],

    quantity: Number,
    pricePerUnit: Number,
    discountPercentage: Number,
    totalAmount: Number,
    finalAmount: Number,

    paymentMethod: String,
    orderStatus: String,
    deliveryType: String,

    storeId: String,
    storeLocation: String,

    salespersonId: String,
    employeeName: String,
  },
  { timestamps: true }
);

/* ✅ Indexes for fast filters (important for evaluation) */
SaleSchema.index({ customerRegion: 1 });
SaleSchema.index({ gender: 1 });
SaleSchema.index({ productCategory: 1 });
SaleSchema.index({ paymentMethod: 1 });
SaleSchema.index({ date: 1 });
SaleSchema.index({ tags: 1 });

export default mongoose.model("Sale", SaleSchema);
