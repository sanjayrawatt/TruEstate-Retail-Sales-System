import Sale from '../models/Sale.js';

/**
 * Get unique filter values from dataset
 */
export const getFilterOptions = async () => {
  try {
    const customerRegions = await Sale.distinct('customerRegion');
    const genders = await Sale.distinct('gender');
    const productCategories = await Sale.distinct('productCategory');
    const paymentMethods = await Sale.distinct('paymentMethod');
    const allTags = await Sale.distinct('tags');

    return {
      customerRegions: customerRegions.sort(),
      genders: genders.sort(),
      productCategories: productCategories.sort(),
      paymentMethods: paymentMethods.sort(),
      tags: allTags.sort(),
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    throw error;
  }
};

/**
 * Main service function to get sales data with search, filter, sort, and pagination
 */
export const getSalesData = async (queryParams) => {
  try {
    const {
      search,
      customerRegion,
      gender,
      ageMin,
      ageMax,
      productCategory,
      tags,
      paymentMethod,
      dateStart,
      dateEnd,
      sortBy,
      sortOrder,
      page,
      pageSize,
    } = queryParams;

    // Parse pagination params with defaults
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(pageSize) || 10;

    // Build MongoDB query
    const query = {};

    // Search: Full-text search on customerName and phoneNumber
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Customer Region filter
    if (customerRegion && (Array.isArray(customerRegion) ? customerRegion.length > 0 : customerRegion)) {
      const regions = Array.isArray(customerRegion) ? customerRegion : [customerRegion];
      query.customerRegion = { $in: regions };
    }

    // Gender filter
    if (gender && (Array.isArray(gender) ? gender.length > 0 : gender)) {
      const genders = Array.isArray(gender) ? gender : [gender];
      query.gender = { $in: genders };
    }

    // Age Range filter
    if (ageMin !== undefined && ageMin !== null && ageMin !== '' || ageMax !== undefined && ageMax !== null && ageMax !== '') {
      const ageQuery = {};
      if (ageMin !== undefined && ageMin !== null && ageMin !== '') {
        const minAge = parseInt(ageMin);
        if (!isNaN(minAge)) {
          ageQuery.$gte = minAge;
        }
      }
      if (ageMax !== undefined && ageMax !== null && ageMax !== '') {
        const maxAge = parseInt(ageMax);
        if (!isNaN(maxAge)) {
          ageQuery.$lte = maxAge;
        }
      }
      if (Object.keys(ageQuery).length > 0) {
        query.age = ageQuery;
      }
    }

    // Product Category filter
    if (productCategory && (Array.isArray(productCategory) ? productCategory.length > 0 : productCategory)) {
      const categories = Array.isArray(productCategory) ? productCategory : [productCategory];
      query.productCategory = { $in: categories };
    }

    // Tags filter
    if (tags && (Array.isArray(tags) ? tags.length > 0 : tags)) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Payment Method filter
    if (paymentMethod && (Array.isArray(paymentMethod) ? paymentMethod.length > 0 : paymentMethod)) {
      const methods = Array.isArray(paymentMethod) ? paymentMethod : [paymentMethod];
      query.paymentMethod = { $in: methods };
    }

    // Date Range filter
    if (dateStart || dateEnd) {
      query.date = {};
      if (dateStart) {
        query.date.$gte = new Date(dateStart);
      }
      if (dateEnd) {
        const endDate = new Date(dateEnd);
        endDate.setHours(23, 59, 59, 999);
        query.date.$lte = endDate;
      }
    }

    // Build sort object
    let sortObj = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      switch (sortBy) {
        case 'date':
          sortObj.date = order;
          break;
        case 'quantity':
          sortObj.quantity = order;
          break;
        case 'customerName':
          sortObj.customerName = order;
          break;
        default:
          break;
      }
    }

    // Get total count
    const total = await Sale.countDocuments(query);

    // Get paginated data
    const data = await Sale.find(query)
      .sort(sortObj)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return {
      data: data,
      pagination: {
        total,
        page: currentPage,
        pageSize: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    };
  } catch (error) {
    console.error('Error getting sales data:', error);
    throw error;
  }
};
