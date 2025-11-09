import Ajv from "ajv";
import csvToJson from "csvtojson";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

//internal import
import useUtilsFunction from "./useUtilsFunction";
import useDisableForDemo from "./useDisableForDemo";
import { SidebarContext } from "@/context/SidebarContext";
import AttributeServices from "@/services/AttributeServices";
import CategoryServices from "@/services/CategoryServices";
import CouponServices from "@/services/CouponServices";
import CurrencyServices from "@/services/CurrencyServices";
import CustomerServices from "@/services/CustomerServices";
import LanguageServices from "@/services/LanguageServices";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const categorySchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "object" },
    description: { type: "object" },
    icon: { type: "string" },
    status: { type: "string" },
  },
  required: ["name"],
};

const attributeSchema = {
  type: "object",
  properties: {
    status: { type: "string" },
    title: { type: "object" },
    name: { type: "object" },
    variants: { type: "array" },
    option: { type: "string" },
    type: { type: "string" },
  },
  required: ["name", "title"],
};

const couponSchema = {
  type: "object",
  properties: {
    title: { type: "object" },
    couponCode: { type: "string" },
    endTime: { type: "string" },
    discountPercentage: { type: "number" },
    minimumAmount: { type: "number" },
    productType: { type: "string" },
    logo: { type: "string" },
    discountType: { type: "object" },
    status: { type: "string" },
  },
  required: ["title", "couponCode", "endTime", "status"],
};

const customerSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
  required: ["name", "email"],
};

const useFilter = (data) => {
  const ajv = new Ajv({ allErrors: true });

  const [filter, setFilter] = useState("");
  const [sortedField, setSortedField] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchCoupon, setSearchCoupon] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [attributeTitle, setAttributeTitle] = useState("");
  const [country, setCountry] = useState("");
  const [zone, setZone] = useState("");
  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [time, setTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const [todayOrder, setTodayOrder] = useState("");
  const [monthlyOrder, setMonthlyOrder] = useState("");
  const [totalOrder, setTotalOrder] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [filename, setFileName] = useState("");
  const [isDisabled, setIsDisable] = useState(false);
  const [shipping, setShipping] = useState("");
  const [newProducts] = useState([]);
  
  const currencyRef = useRef("");
  const searchRef = useRef("");
  const userRef = useRef("");
  const couponRef = useRef("");
  const orderRef = useRef("");
  const categoryRef = useRef("");
  const attributeRef = useRef("");
  const countryRef = useRef("");
  const languageRef = useRef("");
  const taxRef = useRef("");
  const shippingRef = useRef("");

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  
  const location = useLocation();
  const { lang, setIsUpdate, setLoading } = useContext(SidebarContext);
  const { globalSetting } = useUtilsFunction();
  const { handleDisableForDemo } = useDisableForDemo();

  // ============= SERVICE DATA FILTERING - FULLY FIXED =============
  const serviceData = useMemo(() => {
    // CRITICAL FIX: Check if data exists and is an array
    if (!data || !Array.isArray(data)) {
      return [];
    }

    try {
      const date = new Date();
      date.setDate(date.getDate() - (time || 0));
      
      let services = data?.map((el) => {
        const newDate = new Date(el?.updatedAt).toLocaleString("en-US", {
          timeZone: globalSetting?.default_time_zone || "UTC",
        });
        const newObj = {
          ...el,
          updatedDate: newDate === "Invalid Date" ? "" : newDate,
        };
        return newObj;
      });

      // Dashboard statistics
      if (location.pathname === "/dashboard") {
        const orderPending = services?.filter(
          (statusP) => statusP?.status === "Pending"
        ) || [];
        setPending(orderPending);
        
        const orderProcessing = services?.filter(
          (statusO) => statusO?.status === "Processing"
        ) || [];
        setProcessing(orderProcessing);
        
        const orderDelivered = services?.filter(
          (statusD) => statusD?.status === "Delivered"
        ) || [];
        setDelivered(orderDelivered);
        
        // Daily total order calculation
        const todayServices = services?.filter((order) =>
          order?.createdAt ? dayjs(order.createdAt).isToday() : false
        ) || [];
        const todayOrder = todayServices?.reduce(
          (preValue, currentValue) => preValue + (currentValue?.total || 0),
          0
        );
        setTodayOrder(todayOrder);
        
        // Monthly order calculation
        const monthlyServices = services?.filter((order) =>
          order?.createdAt ? dayjs(order.createdAt).isBetween(
            new Date().setDate(new Date().getDate() - 30),
            new Date()
          ) : false
        ) || [];
        const monthlyOrder = monthlyServices?.reduce(
          (preValue, currentValue) => preValue + (currentValue?.total || 0),
          0
        );
        setMonthlyOrder(monthlyOrder);
        
        // Total order calculation
        const totalOrder = services?.reduce(
          (preValue, currentValue) => preValue + (currentValue?.total || 0),
          0
        ) || 0;
        setTotalOrder(totalOrder);
      }

      // Products filtering
      if (filter) {
        services = services.filter((item) => item?.parent === filter);
      }
      
      if (sortedField === "Low") {
        services = services.sort((a, b) => (a?.price || 0) < (b?.price || 0) ? -1 : 1);
      }
      
      if (sortedField === "High") {
        services = services.sort((a, b) => (a?.price || 0) > (b?.price || 0) ? -1 : 1);
      }
      
      if (searchText) {
        services = services.filter((search) =>
          search?.title?.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Attribute filtering - FIXED
      if (attributeTitle) {
        services = services.filter(
          (search) =>
            search?.title?.[lang]
              ?.toLowerCase()
              ?.includes(attributeTitle?.toLowerCase()) ||
            search?.attribute
              ?.toLowerCase()
              .includes(attributeTitle?.toLowerCase())
        );
      }

      // Category filtering - FIXED
      if (categoryType) {
        services = services.filter(
          (search) =>
            search?.name?.[lang]
              ?.toLowerCase()
              ?.includes(categoryType?.toLowerCase()) ||
            search?.category?.toLowerCase().includes(categoryType?.toLowerCase())
        );
      }

      // Admin filtering
      if (role) {
        services = services.filter((staff) => staff?.role === role);
      }

      // User and Customer filtering - FIXED
      if (searchUser) {
        services = services.filter(
          (search) => {
            const nameMultiLang = search?.name?.[lang]?.toLowerCase() || "";
            const nameSingle = search?.name?.toLowerCase() || "";
            const phone = search?.phone?.toLowerCase() || "";
            const email = search?.email?.toLowerCase() || "";
            const searchTerm = searchUser.toLowerCase();
            
            return (
              nameMultiLang.includes(searchTerm) ||
              nameSingle.includes(searchTerm) ||
              phone.includes(searchTerm) ||
              email.includes(searchTerm)
            );
          }
        );
      }

      // Coupon filtering - FIXED
      if (searchCoupon) {
        services = services?.filter(
          (search) => {
            const title = search?.title?.[lang]?.toLowerCase() || "";
            const couponCode = search?.couponCode?.toLowerCase() || "";
            const searchTerm = searchCoupon?.toLowerCase() || "";
            
            return (
              title.includes(searchTerm) ||
              couponCode.includes(searchTerm)
            );
          }
        );
      }

      // Order filtering - FIXED for 500 errors
      if (status) {
        services = services.filter((order) => order?.status === status);
      }
      
      if (searchOrder) {
        services = services.filter((search) => {
          // Handle multiple possible order data structures
          const contact = search?.contact?.toLowerCase() || "";
          const customerName = search?.user?.name?.toLowerCase() || "";
          const customerPhone = search?.user?.phone?.toLowerCase() || "";
          const customerEmail = search?.user?.email?.toLowerCase() || "";
          const phone = search?.phone?.toLowerCase() || "";
          const name = search?.name?.toLowerCase() || "";
          const orderNumber = search?.invoice?.toString().toLowerCase() || "";
          const orderId = search?._id?.toLowerCase() || "";
          
          const searchTerm = searchOrder.toLowerCase();
          
          return (
            contact.includes(searchTerm) ||
            customerName.includes(searchTerm) ||
            customerPhone.includes(searchTerm) ||
            customerEmail.includes(searchTerm) ||
            phone.includes(searchTerm) ||
            name.includes(searchTerm) ||
            orderNumber.includes(searchTerm) ||
            orderId.includes(searchTerm)
          );
        });
      }
      
      if (time) {
        services = services.filter((order) =>
          order?.createdAt ? dayjs(order.createdAt).isBetween(date, new Date()) : false
        );
      }

      // Country filtering - FIXED
      if (country) {
        services = services.filter(
          (cou) => {
            const name = cou?.name?.toLowerCase() || "";
            const isoCode = cou?.iso_code?.toLowerCase() || "";
            const searchTerm = country.toLowerCase();
            
            return (
              name.includes(searchTerm) ||
              isoCode.includes(searchTerm)
            );
          }
        );
      }

      // Shipping filtering - FIXED
      if (shipping) {
        services = services.filter((ship) =>
          ship?.name?.toLowerCase().includes(shipping.toLowerCase())
        );
      }

      // Language filtering - FIXED
      if (language) {
        services = services.filter(
          (lan) => {
            const name = lan?.name?.toLowerCase() || "";
            const isoCode = lan?.iso_code?.toLowerCase() || "";
            const languageCode = lan?.language_code?.toLowerCase() || "";
            const searchTerm = language.toLowerCase();
            
            return (
              name.includes(searchTerm) ||
              isoCode.includes(searchTerm) ||
              languageCode.includes(searchTerm)
            );
          }
        );
      }

      // Currency filtering - FIXED
      if (currency) {
        services = services.filter((cur) =>
          cur?.iso_code?.toLowerCase().includes(currency.toLowerCase())
        );
      }

      return services || [];
    } catch (error) {
      console.error("Filter error:", error);
      return [];
    }
  }, [
    time,
    data,
    location.pathname,
    filter,
    sortedField,
    searchText,
    attributeTitle,
    categoryType,
    role,
    searchUser,
    searchCoupon,
    status,
    searchOrder,
    country,
    shipping,
    language,
    currency,
    globalSetting?.default_time_zone,
    lang,
  ]);

  // ============= PAGINATION - FIXED =============
  const resultsPerPage = 20;
  const totalResults = serviceData?.length || 0;
  
  const handleChangePage = (p) => {
    setCurrentPage(p);
  };
  
  useEffect(() => {
    setDataTable(
      serviceData?.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
      ) || []
    );
  }, [serviceData, currentPage, resultsPerPage]);

  // ============= FORM SUBMIT HANDLERS - FIXED =============
  const handleSubmitForAll = (e) => {
    e.preventDefault();
    setSearchText(searchRef.current?.value || "");
  };
  
  const handleSubmitUser = (e) => {
    e.preventDefault();
    setSearchUser(userRef.current?.value || "");
  };
  
  const handleSubmitCoupon = (e) => {
    e.preventDefault();
    setSearchCoupon(couponRef.current?.value || "");
  };
  
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setSearchOrder(orderRef.current?.value || "");
  };
  
  const handleSubmitCategory = (e) => {
    e.preventDefault();
    setCategoryType(categoryRef.current?.value || "");
  };
  
  const handleSubmitAttribute = (e) => {
    e.preventDefault();
    setAttributeTitle(attributeRef.current?.value || "");
  };

  const handleSubmitCountry = (e) => {
    e.preventDefault();
    setCountry(countryRef.current?.value || "");
  };

  const handleSubmitShipping = (e) => {
    e.preventDefault();
    setShipping(shippingRef.current?.value || "");
  };
  
  const handleSubmitLanguage = (e) => {
    e.preventDefault();
    setLanguage(languageRef.current?.value || "");
  };
  
  const handleSubmitCurrency = (e) => {
    e.preventDefault();
    setCurrency(currencyRef.current?.value || "");
  };

  // ============= CSV/JSON FILE HANDLING =============
  const handleOnDrop = (data) => {
    for (let i = 0; i < data.length; i++) {
      newProducts.push(data[i].data);
    }
  };
  
  const handleUploadProducts = () => {
    if (newProducts.length < 1) {
      notifyError("Please upload/select csv file first!");
    } else {
      if (handleDisableForDemo()) {
        return;
      }
      ProductServices.addAllProducts(newProducts)
        .then((res) => {
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
  };
  
  const handleSelectFile = (e) => {
    e.preventDefault();
    if (handleDisableForDemo()) {
      return;
    }

    const fileReader = new FileReader();
    const file = e.target?.files?.[0];

    if (!file) {
      notifyError("No file selected!");
      return;
    }

    if (file.type === "application/json") {
      setFileName(file?.name);
      setIsDisable(true);

      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (e) => {
        try {
          let text = JSON.parse(e.target.result);
          let data = [];
          
          if (location.pathname === "/categories") {
            data = text.map((value) => {
              return {
                _id: value._id,
                id: value.id,
                status: value.status,
                name: value.name,
                description: value.description,
                parentName: value.parentName,
                parentId: value.parentId,
                icon: value.icon,
              };
            });
          }
          
          if (location.pathname === "/attributes") {
            data = text.map((value) => {
              return {
                _id: value._id,
                status: value.status,
                title: value.title,
                name: value.name,
                variants: value.variants,
                option: value.option,
                type: value.type,
              };
            });
          }

          if (location.pathname === "/coupons") {
            data = text.map((value) => {
              return {
                title: value.title,
                couponCode: value.couponCode,
                endTime: value.endTime,
                discountPercentage: value.discountPercentage,
                minimumAmount: value.minimumAmount,
                productType: value.productType,
                logo: value.logo,
                discountType: value.discountType,
                status: value.status,
              };
            });
          }
          
          if (location.pathname === "/customers") {
            data = text.map((value) => {
              return {
                name: value.name,
                email: value.email,
                password: value.password,
                phone: value.phone,
              };
            });
          }
          
          setSelectedFile(data);
        } catch (error) {
          notifyError("Invalid JSON file format!");
          console.error("JSON parse error:", error);
        }
      };
    } else if (file.type === "text/csv") {
      setFileName(file?.name);
      setIsDisable(true);

      fileReader.onload = async (event) => {
        try {
          const text = event.target.result;
          const json = await csvToJson().fromString(text);
          let data = [];

          if (location.pathname === "/categories") {
            data = json.map((value) => {
              return {
                _id: value._id,
                id: value.id,
                status: value.status,
                name: JSON.parse(value.name),
                description: JSON.parse(value.description),
                parentName: value.parentName,
                parentId: value.parentId,
                icon: value.icon,
              };
            });
          }
          
          if (location.pathname === "/attributes") {
            data = json.map((value) => {
              return {
                status: value.status,
                title: JSON.parse(value.title),
                name: JSON.parse(value.name),
                variants: JSON.parse(value.variants),
                option: value.option,
                type: value.type,
              };
            });
          }

          if (location.pathname === "/coupons") {
            data = json.map((value) => {
              return {
                title: JSON.parse(value.title),
                couponCode: value.couponCode,
                endTime: value.endTime,
                discountPercentage: value.discountPercentage
                  ? JSON.parse(value.discountPercentage)
                  : 0,
                minimumAmount: value.minimumAmount
                  ? JSON.parse(value.minimumAmount)
                  : 0,
                productType: value.productType,
                logo: value.logo,
                status: value.status,
              };
            });
          }
          
          if (location.pathname === "/customers") {
            data = json.map((value) => {
              return {
                name: value.name,
                email: value.email,
                password: value.password,
                phone: value.phone,
              };
            });
          }
          
          setSelectedFile(data);
        } catch (error) {
          notifyError("Invalid CSV file format!");
          console.error("CSV parse error:", error);
        }
      };
      fileReader.readAsText(file);
    } else {
      setFileName(file?.name);
      setIsDisable(true);
      notifyError("Unsupported file type! Please upload JSON or CSV file.");
    }
  };

  const handleUploadMultiple = (e) => {
    if (handleDisableForDemo()) {
      return;
    }

    if (selectedFile.length > 0) {
      // Categories upload
      if (location.pathname === "/categories") {
        setLoading(true);
        let categoryDataValidation = selectedFile.map((value) =>
          ajv.validate(categorySchema, value)
        );

        const isBelowThreshold = (currentValue) => currentValue === true;
        const validationData = categoryDataValidation.every(isBelowThreshold);

        if (validationData) {
          CategoryServices.addAllCategory(selectedFile)
            .then((res) => {
              setLoading(false);
              setIsUpdate(true);
              notifySuccess(res.message);
            })
            .catch((err) => {
              setLoading(false);
              notifyError(err ? err?.response?.data?.message : err.message);
            });
        } else {
          setLoading(false);
          notifyError("Please enter valid category data!");
        }
      }
      
      // Customers upload
      if (location.pathname === "/customers") {
        setLoading(true);
        let customerDataValidation = selectedFile.map((value) =>
          ajv.validate(customerSchema, value)
        );

        const isBelowThreshold = (currentValue) => currentValue === true;
        const validationData = customerDataValidation.every(isBelowThreshold);

        if (validationData) {
          CustomerServices.addAllCustomers(selectedFile)
            .then((res) => {
              setLoading(false);
              setIsUpdate(true);
              notifySuccess(res.message);
            })
            .catch((err) => {
              setLoading(false);
              notifyError(err ? err?.response?.data?.message : err.message);
            });
        } else {
          setLoading(false);
          notifyError("Please enter valid customer data!");
        }
      }
      
      // Coupons upload
      if (location.pathname === "/coupons") {
        setLoading(true);
        let couponDataValidation = selectedFile.map((value) =>
          ajv.validate(couponSchema, value)
        );

        const isBelowThreshold = (currentValue) => currentValue === true;
        const validationData = couponDataValidation.every(isBelowThreshold);

        if (validationData) {
          CouponServices.addAllCoupon(selectedFile)
            .then((res) => {
              setLoading(false);
              setIsUpdate(true);
              notifySuccess(res.message);
            })
            .catch((err) => {
              setLoading(false);
              notifyError(err ? err?.response?.data?.message : err.message);
            });
        } else {
          setLoading(false);
          notifyError("Please enter valid coupon data!");
        }
      }
      
      // Attributes upload
      if (location.pathname === "/attributes") {
        setLoading(true);
        let attributeDataValidation = selectedFile.map((value) =>
          ajv.validate(attributeSchema, value)
        );

        const isBelowThreshold = (currentValue) => currentValue === true;
        const validationData = attributeDataValidation.every(isBelowThreshold);

        if (validationData) {
          AttributeServices.addAllAttributes(selectedFile)
            .then((res) => {
              setLoading(false);
              setIsUpdate(true);
              notifySuccess(res.message);
            })
            .catch((err) => {
              setLoading(false);
              notifyError(err ? err?.response?.data?.message : err.message);
            });
        } else {
          setLoading(false);
          notifyError("Please enter valid attribute data!");
        }
      }

      // Languages upload
      if (location.pathname === "/languages") {
        setLoading(true);
        LanguageServices.addAllLanguage(selectedFile)
          .then((res) => {
            setLoading(false);
            setIsUpdate(true);
            notifySuccess(res.message);
          })
          .catch((err) => {
            setLoading(false);
            notifyError(err ? err?.response?.data?.message : err.message);
          });
      }

      // Currencies upload
      if (location.pathname === "/currencies") {
        setLoading(true);
        CurrencyServices.addAllCurrency(selectedFile)
          .then((res) => {
            setLoading(false);
            setIsUpdate(true);
            notifySuccess(res.message);
          })
          .catch((err) => {
            setLoading(false);
            notifyError(err ? err?.response?.data?.message : err.message);
          });
      }
    } else {
      notifyError("Please select a valid .JSON/.CSV file first!");
    }
  };

  const handleRemoveSelectFile = (e) => {
    setFileName("");
    setSelectedFile([]);
    setTimeout(() => setIsDisable(false), 1000);
  };

  // ============= RETURN ALL VALUES =============
  return {
    userRef,
    searchRef,
    couponRef,
    orderRef,
    categoryRef,
    attributeRef,
    pending,
    processing,
    delivered,
    todayOrder,
    monthlyOrder,
    totalOrder,
    setFilter,
    setSortedField,
    setStatus,
    setRole,
    time,
    zone,
    setTime,
    taxRef,
    setZone,
    filename,
    countryRef,
    dataTable,
    serviceData,
    country,
    setSearchText,
    setCountry,
    isDisabled,
    languageRef,
    currencyRef,
    shippingRef,
    setSearchUser,
    setDataTable,
    setCategoryType,
    handleChangePage,
    totalResults,
    resultsPerPage,
    handleOnDrop,
    setSearchCoupon,
    setAttributeTitle,
    handleSelectFile,
    handleSubmitUser,
    handleSubmitForAll,
    handleSubmitCoupon,
    handleSubmitOrder,
    handleSubmitCategory,
    handleSubmitAttribute,
    handleUploadProducts,
    handleSubmitCountry,
    handleSubmitCurrency,
    handleSubmitShipping,
    handleSubmitLanguage,
    handleUploadMultiple,
    handleRemoveSelectFile,
  };
};

export default useFilter;
