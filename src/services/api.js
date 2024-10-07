const apiUrl = "";
const apis = {
  init: apiUrl + "/api/users/init",
  unload: apiUrl + "/api/users/unload",
  logout: apiUrl + "/api/auth/logout",
  login: apiUrl + "/api/auth/login",
  register: apiUrl + "/api/auth/register",
  resetPassword: apiUrl + "/api/auth/reset-password",
  forgotPassword: apiUrl + "/api/auth/forgot-password",
  me: apiUrl + "/api/auth/me",
  ads: apiUrl + "/api/ads",
  postAd: "/api/ads/post-ad", // GET for getting all user ads and POST for posting ad
  ad: apiUrl + "/api/ads/ad/", // GET for getting single ad
  users: apiUrl + "/api/users",
  changePassword: "/api/users/change-password",
  changeEmail: "/api/users/change-email",
  deleteAccount: "/api/users/delete-account",
  search: apiUrl + "/api/ads/search",
  addToWishlist: "/api/ads/add-to-wishlist",
  removeFromWishlist: "/api/ads/remove-from-wishlist",
  userAds: "/api/ads/user-ads/",
  getWishlist: "/api/ads/wishlist/",
  saveSearch: "/api/ads/save-search",
  deleteSearch: "/api/ads/delete-search",
  deleteAllSearches: "/api/ads/delete-all-searches",
  fetchCategories: "/api/categories/data",
  fetchProvinces: "/api/location/provinces",
  fetchCities: "/api/location/cities",
  findMyLocation: "/api/location/find-my-location",
  getUser: "/api/users/",
  getPublicStripeKey: "/api/payment/config",
  createPaymentIntent: "/api/payment/create-payment-intent",
  confirmPayment: "/api/payment/confirm-payment/",
  updateBusinessInfo: "/api/users/update-business-info/",
  getOnlineStatus: "/api/users/get-status/",
  batchUpdate: "/api/ads/batch",
  relistAd: "/api/ads/relist/",
  getStats: "/api/users/get-stats",
  getAdsCount: "/api/ads/ads-count-data/",
  getBalance: "/api/users/balance",
  payWithBalance: "/api/payment/pay-with-balance",
  updateConfig: "/api/ads/update-config/",
  changeRecurringStatus: "/api/ads/change-recurring-status/",
  googleOAuth: "/api/auth/google",
  facebookOAuth: "/api/auth/facebook",
  createVerificationCode: "/api/users/create-verification-code",
  createPassword: "/api/users/create-password",
  changePassword: "/api/users/change-password",
  updateUserConfig: "/api/users/update-config",
  addBillingAddress: "/api/users/add-billing-address",
  removeBillingAddress: "/api/users/remove-billing-address",
  getTransactions: "/api/payment/transactions",
  getAdInfo: "/api/ads/ad-info/",
  getDoc: "/api/documents/",
  // for admins only
  manage: apiUrl + "/api/manage",
  manageSearch: apiUrl + "/api/manage/search",
  manageDeleteItems: apiUrl + "/api/manage/delete-items",
  manageUpdateItems: apiUrl + "/api/manage/update-items",
  manageGetUser: apiUrl + "/api/manage/user/",
  manageGetUserAds: apiUrl + "/api/manage/ads",
  manageGetUserAd: "/api/manage/ad",
  manageGetUserFavtAds: apiUrl + "/api/manage/favorites",
  getCategoryData: apiUrl + "/api/categories/data",
  deleteCategories: apiUrl + "/api/categories/delete-categories",
  activateCategories: apiUrl + "/api/categories/activate-categories",
  deactivateCategories: apiUrl + "/api/categories/deactivate-categories",
  makeCategory: apiUrl + "/api/categories/make-category",
  makeSubCategory: apiUrl + "/api/categories/make-sub-category/",
  deleteSubCategories: apiUrl + "/api/categories/delete-sub-categories",
  deactivateSubCategories:
    apiUrl + "/api/categories/deactivate-sub-categories/",
  activateSubCategories: apiUrl + "/api/categories/activate-sub-categories/",
  deleteCategoryFields: apiUrl + "/api/categories/delete-category-fields/",
  deleteSubCategoryFields:
    apiUrl + "/api/categories/delete-sub-category-fields/",
  makeCategoryField: apiUrl + "/api/categories/make-category-field/",
  makeSubCategoryField: apiUrl + "/api/categories/make-sub-category-field/",
  updateCategory: apiUrl + "/api/categories/update-category/",
  updateSubCategory: apiUrl + "/api/categories/update-sub-category/",
  updateCategoryRules: apiUrl + "/api/categories/update-category-rules/",
  updateSubCategoryRules: apiUrl + "/api/categories/update-sub-category-rules/",
  revertSubCategoryRules: apiUrl + "/api/categories/revert-sub-category-rules/",
  changeCategoryFieldOrder:
    apiUrl + "/api/categories/change-category-field-order/",
  changeSubCategoryFieldOrder:
    apiUrl + "/api/categories/change-sub-category-field-order/",
  changeCategoryOrder: apiUrl + "/api/categories/change-category-order/",
  changeSubCategoryOrder: apiUrl + "/api/categories/change-sub-category-order/",
  forceUpdateLocationInDB: apiUrl + "/api/location/sync-locations",
  getuserInfo: apiUrl + "/api/ads/info/",
  postDummyData: apiUrl + "/api/ads/bulk-dummy",
  deleteAd: apiUrl + "/api/ads/",
  pauseAd: apiUrl + "/api/ads/pause/",
  resumeAd: apiUrl + "/api/ads/resume/",
  updatePackages: apiUrl + "/api/categories/update-packages/",
  updateAddOns: apiUrl + "/api/categories/update-add-ons/",
  updateExtras: apiUrl + "/api/categories/update-extras/",
  registerEmployee: apiUrl + "/api/manage/register-employee",
  permissions: apiUrl + "/api/manage/permissions",
  updateCategoryFields: apiUrl + "/api/categories/update-category-fields/",
  updateSubCategoryFields:
    apiUrl + "/api/categories/update-sub-category-fields/",
  executeCommand: apiUrl + "/api/manage/command/",
  updateAccessCode: apiUrl + "/api/manage/update-access-code/",
  createUser: "/api/manage/create-user/",
  getTotalUsers: "/api/dashboard/total-users",
  getTotalAds: "/api/dashboard/total-ads",
  getActiveUsers: "/api/dashboard/active-users",
  getActiveAds: "/api/dashboard/active-ads",
  getRevenueToday: "/api/dashboard/revenue-today",
  getActiveCategories: "/api/dashboard/category-count",
  getVisits: "/api/dashboard/visits",
  getSearches: "/api/dashboard/searches/",
  getUsersGained: "/api/dashboard/users-gained/",
  getSearchAnalytics: "/api/dashboard/search-analytics/",
};

export default apis;
