import { dateFormatter } from "../../../utils/helpers";

export const COLLECTIONS_NAMES = {
  USER: "User",
  DELETED_USER: "Deleted_User",
  AD: "Ad",
  DELETED_AD: "Deleted_Ad",
};

const userKeys = [
  { key: "customerID", label: "Customer ID" },
  { key: "email", label: "Email" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },

  // { key: "user.info.phone", label: "Phone" },
  // { key: "user.info.city", label: "City" },
  // { key: "user._id", label: "User ID" },
  // { key: "user.info.province", label: "Province" },
  // { key: "user.verified", label: "Verified" },
  // { key: "user.authenticationRisk", label: "Authentication Risk" },
  // { key: "user.accountLocked", label: "Account Locked" },
  // { key: "createdAt", label: "CreatedAt" },
  // { key: "user.info.address", label: "Address" },
  // { key: "user.info.postalCode", label: "Postal Code" },
  // { key: "user.info.nickname", label: "Nickname" },
  // { key: "info.phoneHidden", label: "Phone Hidden" },
  // { key: "info.locationHidden", label: "Location Hidden" },
];

const adKeys = [
  { key: "listingID", label: "Listing ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "customerID", label: "Customer ID" },
  { key: "price", label: "Price" },
  { key: "term", label: "Term" },
  { key: "meta.category", label: "Category" },
];

export const conditions = [
  {
    label: "Contains",
    key: "contains",
  },
  {
    label: "Equals",
    key: "eq",
  },
  {
    label: "Not Equals",
    key: "ne",
  },
  {
    label: "Greater Than",
    key: "gt",
  },
  {
    label: "Less Than",
    key: "lt",
  },
  {
    label: "Does Not Contain",
    key: "notContains",
  },
];

export const buildFilterQuery = (filters) => {
  const filterQuery = {};
  console.log(filters);
  filters.forEach((filter) => {
    let { key, condition, value } = filter;
    if (key == "term") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (key === "user.verified" && condition === "eq") {
      value = value === "true" ? true : value === "false" ? false : value;
    }

    switch (condition) {
      case "eq":
        filterQuery[key] = value;
        break;
      case "ne":
        filterQuery[key] = { $ne: value };
        break;
      case "gt":
        filterQuery[key] = { $gt: value };
        break;
      case "lt":
        filterQuery[key] = { $lt: value };
        break;
      case "contains":
        filterQuery[key] = { $regex: value, $options: "i" };
        break;
      case "notContains":
        filterQuery[key] = { $not: { $regex: value, $options: "i" } };
        break;
      default:
        break;
    }
  });

  return filterQuery;
};

const getTheseKeysOnly = (collection) => {
  let keys = {
    users: [
      { label: "Customer ID", path: (u) => u?.customerID },
      { label: "Full Name", path: (u) => u?.firstName + " " + u?.lastName },
      { label: "Email", path: (u) => u?.email },
      { label: "Created", path: (u) => u?.createdAt },
      {
        label: "Account Locked?",
        path: (u) => (u.accountLocked ? true : false),
        update: (u) => {
          return { accountLocked: u.accountLocked ? false : true };
        },
      },
      { label: "Ads", path: (u) => u?.data?.postedAds?.total },
    ],

    ads: [
      { label: "Title", path: (a) => a.title },
      { label: "Price", path: (a) => a.price },
      {
        label: "Status",
        path: (a) => (a.meta?.status == "active" ? true : false),
      },
      { label: "Listing ID", path: (a) => a.listingID },
      { label: "Term", path: (a) => a.term },
      { label: "category", path: (u) => u?.meta?.category },
      { label: "Sub-category", path: (u) => u?.meta?.subCategory },
      { label: "Created", path: (u) => u?.createdAt },
    ],
  };

  switch (collection) {
    case COLLECTIONS_NAMES.USER:
      return keys.users;
    case COLLECTIONS_NAMES.DELETED_USER:
      return keys.users;
    case COLLECTIONS_NAMES.AD:
      return keys.ads;
    case COLLECTIONS_NAMES.DELETED_AD:
      return keys.ads;
    case "FavoriteAds":
      return keys.ads;
    default:
      return [];
  }
};

export const prepareDataForTable = (data, collection) => {
  try {
    let newCols = getTheseKeysOnly(collection);

    if (collection === COLLECTIONS_NAMES.AD) {
      data = data.map((ad) => {
        return {
          ...ad,
          ...ad.meta,
        };
      });
    }

    return {
      rows: data,
      columns: newCols,
    };
  } catch (error) {
    return {
      rows: [],
      columns: [],
    };
  }
};

export const prepareSearchesData = (data) => {
  const rows = [];
  const columns = [];

  if (!data || data.length === 0) {
    return { rows, columns };
  }

  data.forEach((search) => {
    const { query, filters, category } = search;

    const row = {
      query,
      category,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      term: filters?.term,
    };

    Object.keys(row).forEach((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });

    rows.push(row);
  });

  return { rows, columns };
};

export const convertToReadableKey = (key) => {
  try {
    // Convert camelCase to readable format
    key = key.replace(/([a-z])([A-Z])/g, "$1 $2");
    // Replace underscores with spaces and capitalize words
    key = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());
    return key;
  } catch (error) {
    return key;
  }
};

export const collections = [
  {
    label: "Users",
    key: COLLECTIONS_NAMES.USER,
    keys: userKeys,
    sort: { label: "Customer ID", path: (u) => u?.customerID },
  },
  {
    label: "Ads",
    key: COLLECTIONS_NAMES.AD,
    keys: adKeys,
    sort: { label: "Listing ID", path: (a) => a.listingID },
  },
];

export const allKeys = collections.reduce((acc, collection) => {
  acc[collection.key] = collection.keys;
  return acc;
}, {});

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  // const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;

  return formattedDateTime;
}
