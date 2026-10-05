import React, { useEffect, useState } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}, token = '') => {
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

/* =========================================================
   BRAND LOGO
========================================================= */

const BrandLogo = ({ footer = false }) => (
  <div
    className={`brand-logo ${
      footer ? 'brand-logo-footer' : 'brand-logo-header'
    }`}
  >
    <div className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        <path
          d="M10 27.5 32 15l22 12.5-22 12.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M17 32v12.5c0 4.2 6.7 7.5 15 7.5s15-3.3 15-7.5V32"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M32 40c3.5-7.5 10-9.5 15-8.5-1 6.5-5.8 12.5-15 15.5-9.2-3-14-9-15-15.5 5-1 11.5 1 15 8.5z"
          fill="currentColor"
          opacity=".9"
        />
      </svg>
    </div>

    <div className="brand-logo-text">
      <span className="brand-logo-title">ClassMate.com</span>
      <span className="brand-logo-sub">
        Learn • Practice • Connect
      </span>
    </div>
  </div>
);

/* =========================================================
   PAGE HEADER
========================================================= */

const PageHeader = ({ title, subtitle, icon }) => (
  <section
    className="container"
    style={{ padding: '55px 0 25px' }}
  >
    <div className="section-header">
      <div>
        <h1 className="section-title">
          <i
            className={`fa-solid ${icon}`}
            style={{ marginRight: '12px' }}
          ></i>
          {title}
        </h1>

        <p className="section-subtitle">{subtitle}</p>
      </div>
    </div>
  </section>
);

/* =========================================================
   SIMPLE RESOURCE PAGE
========================================================= */

const ResourcePage = ({
  title,
  subtitle,
  icon,
  description,
  buttonText = 'Explore Resources',
  onAction,
}) => (
  <>
    <PageHeader
      title={title}
      subtitle={subtitle}
      icon={icon}
    />

    <section className="container content-grid-section">
      <div
        className="card"
        style={{
          padding: '40px',
          minHeight: '330px',
          textAlign: 'center',
        }}
      >
        <div
          className="feature-icon"
          style={{
            margin: '0 auto 20px',
            fontSize: '32px',
          }}
        >
          <i className={`fa-solid ${icon}`}></i>
        </div>

        <h2>{title}</h2>

        <p
          style={{
            maxWidth: '700px',
            margin: '15px auto 25px',
          }}
        >
          {description}
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onAction}
        >
          {buttonText}
          <i
            className="fa-solid fa-arrow-right"
            style={{ marginLeft: '8px' }}
          ></i>
        </button>
      </div>
    </section>
  </>
);

/* =========================================================
   SHOP PAGE
========================================================= */

const ShopPage = ({
  products,
  loadingProducts,
  productsError,
  onAddToCart,
  cartCount,
  onGoHome,
  onCheckout,
  isLoggedIn,
}) => {
  const formatPrice = (price) => {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return 'Price unavailable';
    }

    return `KSh ${numericPrice.toLocaleString('en-KE')}`;
  };

  const getProductName = (product) =>
    product?.name ||
    product?.title ||
    product?.productName ||
    'ClassMate Learning Book';

  const getProductDescription = (product) =>
    product?.description ||
    product?.shortDescription ||
    product?.details ||
    'ClassMate educational learning material.';

  const getProductPrice = (product) =>
    product?.price ??
    product?.sellingPrice ??
    product?.amount ??
    0;

  const getProductImage = (product) =>
    product?.imageUrl ||
    product?.image ||
    product?.photo ||
    product?.thumbnail ||
    '/images/Colorful ClassMate Grade 5 Textbooks.png';

  return (
    <>
      <PageHeader
        title="ClassMate Shop"
        subtitle="Books, revision materials and learning resources."
        icon="fa-bag-shopping"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        <div
          className="card"
          style={{
            padding: '22px 25px',
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h3 style={{ marginBottom: '5px' }}>
              ClassMate Books & Resources
            </h3>

            <p style={{ margin: 0 }}>
              Choose your learning materials and add them
              to your cart.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              flexWrap: 'wrap',
            }}
          >
            <span>
              <i
                className="fa-solid fa-cart-shopping"
                style={{ marginRight: '7px' }}
              ></i>
              Cart: <strong>{cartCount}</strong>
            </span>

            {cartCount > 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onCheckout}
              >
                Checkout
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline"
              onClick={onGoHome}
            >
              Back Home
            </button>
          </div>
        </div>

        {loadingProducts && (
          <div
            className="card"
            style={{
              padding: '50px',
              textAlign: 'center',
            }}
          >
            <i
              className="fa-solid fa-spinner fa-spin"
              style={{
                fontSize: '30px',
                marginBottom: '15px',
              }}
            ></i>

            <h3>Loading ClassMate products...</h3>

            <p>
              Connecting to the ClassMate Shop backend.
            </p>
          </div>
        )}

        {!loadingProducts && productsError && (
          <div
            className="card"
            style={{
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <i
              className="fa-solid fa-triangle-exclamation"
              style={{
                fontSize: '32px',
                marginBottom: '15px',
              }}
            ></i>

            <h3>Shop temporarily unavailable</h3>

            <p>{productsError}</p>
          </div>
        )}

        {!loadingProducts &&
          !productsError &&
          products.length === 0 && (
            <div
              className="card"
              style={{
                padding: '50px',
                textAlign: 'center',
              }}
            >
              <i
                className="fa-solid fa-box-open"
                style={{
                  fontSize: '40px',
                  marginBottom: '15px',
                }}
              ></i>

              <h3>No products available yet</h3>

              <p>
                ClassMate books and learning materials will
                appear here once products are added to the
                shop.
              </p>
            </div>
          )}

        {!loadingProducts &&
          !productsError &&
          products.length > 0 && (
            <div
              className="shop-products-grid"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '25px',
              }}
            >
              {products.map((product, index) => {
                const productName =
                  getProductName(product);

                const productDescription =
                  getProductDescription(product);

                const productPrice =
                  getProductPrice(product);

                const productImage =
                  getProductImage(product);

                return (
                  <div
                    className="card"
                    key={product?.id || index}
                    style={{
                      overflow: 'hidden',
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        height: '230px',
                        overflow: 'hidden',
                        background: '#f1f5f2',
                      }}
                    >
                      {index === 0 && (
                        <span
                          className="best-seller"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            zIndex: 2,
                          }}
                        >
                          BEST SELLER
                        </span>
                      )}

                      <img
                        src={productImage}
                        alt={productName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(event) => {
                          event.currentTarget.src =
                            '/images/Colorful ClassMate Grade 5 Textbooks.png';
                        }}
                      />
                    </div>

                    <div style={{ padding: '20px' }}>
                      <h3 style={{ marginBottom: '8px' }}>
                        {productName}
                      </h3>

                      <p
                        style={{
                          minHeight: '50px',
                          marginBottom: '12px',
                        }}
                      >
                        {productDescription}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '15px',
                        }}
                      >
                        <strong
                          style={{
                            fontSize: '20px',
                          }}
                        >
                          {formatPrice(productPrice)}
                        </strong>

                        {product?.stock !== undefined && (
                          <span>
                            Stock: {product.stock}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary full-width"
                        onClick={() =>
                          onAddToCart(product)
                        }
                      >
                        <i
                          className="fa-solid fa-cart-shopping"
                          style={{ marginRight: '8px' }}
                        ></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        <div
          className="card"
          style={{
            marginTop: '30px',
            padding: '25px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <i
                className="fa-solid fa-truck-fast"
                style={{
                  fontSize: '24px',
                  marginBottom: '8px',
                }}
              ></i>

              <h4>Delivery Across Kenya</h4>

              <p>
                Order learning materials and have them
                delivered to your location.
              </p>
            </div>

            <div>
              <i
                className="fa-solid fa-shield-halved"
                style={{
                  fontSize: '24px',
                  marginBottom: '8px',
                }}
              ></i>

              <h4>Secure Ordering</h4>

              <p>
                Your order information is handled through
                the ClassMate backend.
              </p>
            </div>

            <div>
              <i
                className="fa-solid fa-location-dot"
                style={{
                  fontSize: '24px',
                  marginBottom: '8px',
                }}
              ></i>

              <h4>Order Tracking</h4>

              <p>
                Delivery tracking will be connected to your
                ClassMate order.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* =========================================================
   APP
========================================================= */

const App = () => {
  const [currentPage, setCurrentPage] =
    useState('home');

  /* =======================================================
     AUTH
  ======================================================= */

  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem('classmate_user');

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error(
        'Failed to load saved user:',
        error
      );

      return null;
    }
  });

  const [authToken, setAuthToken] = useState(
    () =>
      localStorage.getItem('classmate_token') || ''
  );

  const [authMode, setAuthMode] = useState(null);

  const [authForm, setAuthForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [authLoading, setAuthLoading] =
    useState(false);

  const [authError, setAuthError] = useState('');

  const isLoggedIn = Boolean(
    authToken && user
  );

  /* =======================================================
     NOTES
  ======================================================= */

  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] =
    useState(true);
  const [notesError, setNotesError] =
    useState('');

  /* =======================================================
     PAST PAPERS
  ======================================================= */

  const [pastPapers, setPastPapers] =
    useState([]);

  const [loadingPastPapers, setLoadingPastPapers] =
    useState(false);

  const [pastPapersError, setPastPapersError] =
    useState('');

  /* =======================================================
     QUIZZES
  ======================================================= */

  const [quizzes, setQuizzes] =
    useState([]);

  const [loadingQuizzes, setLoadingQuizzes] =
    useState(false);

  const [quizzesError, setQuizzesError] =
    useState('');

  const [quizAttempts, setQuizAttempts] =
    useState([]);

  const [activeQuiz, setActiveQuiz] =
    useState(null);

  const [activeQuizAttempt, setActiveQuizAttempt] =
    useState(null);

  const [quizAnswers, setQuizAnswers] =
    useState({});

  const [quizSubmitting, setQuizSubmitting] =
    useState(false);

  const [quizResult, setQuizResult] =
    useState(null);

  /* =======================================================
     PROGRESS
  ======================================================= */

  const [progress, setProgress] =
    useState([]);

  const [loadingProgress, setLoadingProgress] =
    useState(false);

  /* =======================================================
     COMMUNITY
  ======================================================= */

  const [communityPosts, setCommunityPosts] =
    useState([]);

  const [loadingCommunity, setLoadingCommunity] =
    useState(false);

  const [communityError, setCommunityError] =
    useState('');

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
  });

  const [communitySubmitting, setCommunitySubmitting] =
    useState(false);

  const [commentInputs, setCommentInputs] =
    useState({});

  /* =======================================================
     PRINTABLES
  ======================================================= */

  const [printables, setPrintables] =
    useState([]);

  const [loadingPrintables, setLoadingPrintables] =
    useState(false);

  const [printablesError, setPrintablesError] =
    useState('');

  /* =======================================================
     SHOP
  ======================================================= */

  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const [productsError, setProductsError] =
    useState('');

  const [cart, setCart] = useState([]);

  /* =======================================================
     AI
  ======================================================= */

  const [aiQuestion, setAiQuestion] =
    useState('');

  const [aiAnswer, setAiAnswer] =
    useState('');

  const [aiLoading, setAiLoading] =
    useState(false);

  const [aiError, setAiError] =
    useState('');

  /* =======================================================
     PROFILE
  ======================================================= */

  const [studentProfile, setStudentProfile] =
    useState(null);

  const [loadingProfile, setLoadingProfile] =
    useState(false);

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const [notifications, setNotifications] =
    useState([]);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  /* =======================================================
     ORDERS
  ======================================================= */

  const [orders, setOrders] = useState([]);

  const [loadingOrders, setLoadingOrders] =
    useState(false);

  const [orderMessage, setOrderMessage] =
    useState('');

  /* =======================================================
     SEARCH
  ======================================================= */

  const [searchQuery, setSearchQuery] =
    useState('');

  const [searchResults, setSearchResults] =
    useState(null);

  const [searchLoading, setSearchLoading] =
    useState(false);

  /* =======================================================
     LOAD NOTES
  ======================================================= */

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoadingNotes(true);
        setNotesError('');

        const data = await apiFetch('/notes');

        console.log(
          'ClassMate Notes from backend:',
          data
        );

        let receivedNotes = [];

        if (Array.isArray(data)) {
          receivedNotes = data;
        } else if (
          Array.isArray(data?.notes)
        ) {
          receivedNotes = data.notes;
        } else if (
          Array.isArray(data?.data)
        ) {
          receivedNotes = data.data;
        }

        setNotes(receivedNotes);
      } catch (error) {
        console.error(
          'ClassMate Notes API error:',
          error
        );

        setNotesError(
          'Unable to load notes from the ClassMate server.'
        );

        setNotes([]);
      } finally {
        setLoadingNotes(false);
      }
    };

    loadNotes();
  }, []);

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError('');

        const data =
          await apiFetch('/products');

        console.log(
          'ClassMate Products from backend:',
          data
        );

        let receivedProducts = [];

        if (Array.isArray(data)) {
          receivedProducts = data;
        } else if (
          Array.isArray(data?.products)
        ) {
          receivedProducts = data.products;
        } else if (
          Array.isArray(data?.data)
        ) {
          receivedProducts = data.data;
        }

        setProducts(receivedProducts);
      } catch (error) {
        console.error(
          'ClassMate Products API error:',
          error
        );

        setProductsError(
          'Unable to load products from the ClassMate Shop server.'
        );

        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  /* =======================================================
     AUTHENTICATION ACTIONS
  ======================================================= */

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthError('');

    setAuthForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  };

  const closeAuth = () => {
    if (authLoading) return;

    setAuthMode(null);
    setAuthError('');
  };

  const saveAuthentication = (
    token,
    loggedInUser
  ) => {
    localStorage.setItem(
      'classmate_token',
      token
    );

    localStorage.setItem(
      'classmate_user',
      JSON.stringify(loggedInUser)
    );

    setAuthToken(token);
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem(
      'classmate_token'
    );

    localStorage.removeItem(
      'classmate_user'
    );

    setAuthToken('');
    setUser(null);
    setCurrentPage('home');

    setStudentProfile(null);
    setProgress([]);
    setQuizAttempts([]);
    setNotifications([]);
    setOrders([]);
  };

  const requireLogin = () => {
    if (!isLoggedIn) {
      openAuth('login');
      return false;
    }

    return true;
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    setAuthLoading(true);
    setAuthError('');

    try {
      const endpoint =
        authMode === 'login'
          ? '/auth/login'
          : '/auth/register';

      const body =
        authMode === 'login'
          ? {
              email: authForm.email,
              password: authForm.password,
            }
          : {
              firstName: authForm.firstName,
              lastName: authForm.lastName,
              email: authForm.email,
              password: authForm.password,
            };

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      console.log(
        'ClassMate authentication response:',
        data
      );

      /*
        Supports both:

        {
          token,
          user
        }

        and the older nested response:

        {
          user: {
            token,
            user
          }
        }
      */

      let token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.user?.token ||
        data?.user?.accessToken;

      let loggedInUser =
        data?.user?.user ||
        data?.data?.user ||
        data?.user;

      if (
        !token &&
        typeof data?.user === 'object'
      ) {
        token =
          data.user.token ||
          data.user.accessToken;
      }

      if (!loggedInUser) {
        loggedInUser =
          data?.data ||
          {
            email: authForm.email,
          };
      }

      if (!token) {
        throw new Error(
          'The server did not return an authentication token.'
        );
      }

      saveAuthentication(
        token,
        loggedInUser
      );

      setAuthMode(null);

      setAuthForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    } catch (error) {
      console.error(
        'ClassMate authentication error:',
        error
      );

      setAuthError(
        error.message ||
          'Unable to connect to the ClassMate authentication server.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  /* =======================================================
     LOAD AUTHENTICATED DATA
  ======================================================= */

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadAuthenticatedData = async () => {
      try {
        setLoadingProgress(true);
        setLoadingProfile(true);
        setLoadingNotifications(true);
        setLoadingOrders(true);

        const [
          progressData,
          profileData,
          notificationData,
          orderData,
        ] = await Promise.allSettled([
          apiFetch(
            '/progress/me',
            {},
            authToken
          ),
          apiFetch(
            '/student-profile/me',
            {},
            authToken
          ),
          apiFetch(
            '/notifications/me',
            {},
            authToken
          ),
          apiFetch(
            '/orders/me',
            {},
            authToken
          ),
        ]);

        if (
          progressData.status === 'fulfilled'
        ) {
          const value =
            progressData.value;

          setProgress(
            Array.isArray(value)
              ? value
              : value?.progress || []
          );
        }

        if (
          profileData.status === 'fulfilled'
        ) {
          const value =
            profileData.value;

          setStudentProfile(
            value?.profile ||
              value?.data ||
              value ||
              null
          );
        }

        if (
          notificationData.status ===
          'fulfilled'
        ) {
          const value =
            notificationData.value;

          setNotifications(
            Array.isArray(value)
              ? value
              : value?.notifications || []
          );
        }

        if (
          orderData.status === 'fulfilled'
        ) {
          const value =
            orderData.value;

          setOrders(
            Array.isArray(value)
              ? value
              : value?.orders || []
          );
        }
      } catch (error) {
        console.error(
          'Failed to load authenticated ClassMate data:',
          error
        );
      } finally {
        setLoadingProgress(false);
        setLoadingProfile(false);
        setLoadingNotifications(false);
        setLoadingOrders(false);
      }
    };

    loadAuthenticatedData();
  }, [isLoggedIn, authToken]);

  /* =======================================================
     LOAD PAST PAPERS
  ======================================================= */

  const loadPastPapers = async () => {
    try {
      setLoadingPastPapers(true);
      setPastPapersError('');

      const data =
        await apiFetch('/past-papers');

      const received =
        Array.isArray(data)
          ? data
          : data?.papers || data?.data || [];

      setPastPapers(received);
    } catch (error) {
      console.error(
        'Past papers error:',
        error
      );

      setPastPapersError(
        error.message ||
          'Unable to load past papers.'
      );

      setPastPapers([]);
    } finally {
      setLoadingPastPapers(false);
    }
  };

  /* =======================================================
     LOAD QUIZZES
  ======================================================= */

  const loadQuizzes = async () => {
    try {
      setLoadingQuizzes(true);
      setQuizzesError('');

      const data =
        await apiFetch('/quizzes');

      const received =
        Array.isArray(data)
          ? data
          : data?.quizzes ||
            data?.data ||
            [];

      setQuizzes(received);
    } catch (error) {
      console.error(
        'Quizzes error:',
        error
      );

      setQuizzesError(
        error.message ||
          'Unable to load quizzes.'
      );

      setQuizzes([]);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  /* =======================================================
     LOAD QUIZ ATTEMPTS
  ======================================================= */

  const loadQuizAttempts = async () => {
    if (!requireLogin()) return;

    try {
      const data =
        await apiFetch(
          '/quizzes/attempts/me',
          {},
          authToken
        );

      setQuizAttempts(
        Array.isArray(data)
          ? data
          : data?.attempts ||
              data?.data ||
              []
      );
    } catch (error) {
      console.error(
        'Quiz attempts error:',
        error
      );
    }
  };

  /* =======================================================
     LOAD COMMUNITY
  ======================================================= */

  const loadCommunity = async () => {
    try {
      setLoadingCommunity(true);
      setCommunityError('');

      const data =
        await apiFetch('/community');

      setCommunityPosts(
        Array.isArray(data)
          ? data
          : data?.posts ||
              data?.data ||
              []
      );
    } catch (error) {
      console.error(
        'Community error:',
        error
      );

      setCommunityError(
        error.message ||
          'Unable to load community posts.'
      );

      setCommunityPosts([]);
    } finally {
      setLoadingCommunity(false);
    }
  };

  /* =======================================================
     LOAD PRINTABLES
  ======================================================= */

  const loadPrintables = async () => {
    try {
      setLoadingPrintables(true);
      setPrintablesError('');

      const data =
        await apiFetch('/printables');

      setPrintables(
        Array.isArray(data)
          ? data
          : data?.printables ||
              data?.data ||
              []
      );
    } catch (error) {
      console.error(
        'Printables error:',
        error
      );

      setPrintablesError(
        error.message ||
          'Unable to load printable resources.'
      );

      setPrintables([]);
    } finally {
      setLoadingPrintables(false);
    }
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigateTo = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    if (page === 'past-papers') {
      loadPastPapers();
    }

    if (page === 'quizzes') {
      loadQuizzes();
      if (isLoggedIn) {
        loadQuizAttempts();
      }
    }

    if (page === 'community') {
      loadCommunity();
    }

    if (page === 'print') {
      loadPrintables();
    }
  };

  /* =======================================================
     CART
  ======================================================= */

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    alert(
      `${
        product?.name ||
        product?.title ||
        'Product'
      } added to cart.`
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  };

  const updateCartQuantity = (
    productId,
    quantity
  ) => {
    const numericQuantity =
      Number(quantity);

    if (numericQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity:
                numericQuantity,
            }
          : item
      )
    );
  };

  const cartCount = cart.reduce(
    (total, item) =>
      total + (item.quantity || 0),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        (item.quantity || 0),
    0
  );

  /* =======================================================
     CHECKOUT
  ======================================================= */

  const checkout = async () => {
    if (!requireLogin()) return;

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      setOrderMessage('');

      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: Number(item.price || 0),
      }));

      const data = await apiFetch(
        '/orders',
        {
          method: 'POST',
          body: JSON.stringify({
            items,
          }),
        },
        authToken
      );

      const createdOrder =
        data?.order || data;

      if (createdOrder) {
        setOrders((current) => [
          createdOrder,
          ...current,
        ]);
      }

      setCart([]);

      setOrderMessage(
        'Your ClassMate order was created successfully.'
      );

      alert(
        'Order created successfully.'
      );
    } catch (error) {
      console.error(
        'Checkout error:',
        error
      );

      setOrderMessage(
        error.message ||
          'Unable to create your order.'
      );

      alert(
        error.message ||
          'Unable to create your order.'
      );
    }
  };

  /* =======================================================
     START QUIZ
  ======================================================= */

  const startQuiz = async (quiz) => {
    if (!requireLogin()) return;

    try {
      setQuizResult(null);
      setQuizAnswers({});

      const data =
        await apiFetch(
          `/quizzes/${quiz.id}/start`,
          {
            method: 'POST',
          },
          authToken
        );

      setActiveQuiz(quiz);

      setActiveQuizAttempt(
        data?.attempt ||
          data?.data ||
          data
      );
    } catch (error) {
      console.error(
        'Start quiz error:',
        error
      );

      alert(
        error.message ||
          'Unable to start this quiz.'
      );
    }
  };

  /* =======================================================
     SUBMIT QUIZ
  ======================================================= */

  const submitQuiz = async () => {
    if (
      !activeQuiz ||
      !activeQuizAttempt
    ) {
      return;
    }

    try {
      setQuizSubmitting(true);

      const answers = Object.entries(
        quizAnswers
      ).map(
        ([questionId, answer]) => ({
          questionId: Number(
            questionId
          ),
          answer,
        })
      );

      const data =
        await apiFetch(
          `/quizzes/${activeQuiz.id}/attempts/${activeQuizAttempt.id}/submit`,
          {
            method: 'POST',
            body: JSON.stringify({
              answers,
            }),
          },
          authToken
        );

      setQuizResult(
        data?.result ||
          data?.data ||
          data
      );

      await loadQuizAttempts();
    } catch (error) {
      console.error(
        'Submit quiz error:',
        error
      );

      alert(
        error.message ||
          'Unable to submit quiz.'
      );
    } finally {
      setQuizSubmitting(false);
    }
  };

  /* =======================================================
     COMMUNITY POST
  ======================================================= */

  const createCommunityPost = async (
    event
  ) => {
    event.preventDefault();

    if (!requireLogin()) return;

    if (
      !newPost.title.trim() ||
      !newPost.content.trim()
    ) {
      alert(
        'Please enter a title and message.'
      );

      return;
    }

    try {
      setCommunitySubmitting(true);

      const data =
        await apiFetch(
          '/community',
          {
            method: 'POST',
            body: JSON.stringify({
              title: newPost.title,
              content: newPost.content,
              category:
                newPost.category,
            }),
          },
          authToken
        );

      const post =
        data?.post || data;

      if (post) {
        setCommunityPosts(
          (current) => [
            post,
            ...current,
          ]
        );
      }

      setNewPost({
        title: '',
        content: '',
        category: 'GENERAL',
      });
    } catch (error) {
      console.error(
        'Create community post error:',
        error
      );

      alert(
        error.message ||
          'Unable to create your post.'
      );
    } finally {
      setCommunitySubmitting(false);
    }
  };

  /* =======================================================
     COMMUNITY LIKE
  ======================================================= */

  const toggleLike = async (post) => {
    if (!requireLogin()) return;

    try {
      const liked =
        Boolean(
          post?.likedByMe ||
            post?.isLiked
        );

      if (liked) {
        await apiFetch(
          `/community/${post.id}/like`,
          {
            method: 'DELETE',
          },
          authToken
        );
      } else {
        await apiFetch(
          `/community/${post.id}/like`,
          {
            method: 'POST',
          },
          authToken
        );
      }

      await loadCommunity();
    } catch (error) {
      console.error(
        'Like error:',
        error
      );

      alert(
        error.message ||
          'Unable to update like.'
      );
    }
  };

  /* =======================================================
     COMMUNITY COMMENT
  ======================================================= */

  const addComment = async (postId) => {
    if (!requireLogin()) return;

    const content =
      commentInputs[postId] || '';

    if (!content.trim()) return;

    try {
      await apiFetch(
        `/community/${postId}/comments`,
        {
          method: 'POST',
          body: JSON.stringify({
            content,
          }),
        },
        authToken
      );

      setCommentInputs((current) => ({
        ...current,
        [postId]: '',
      }));

      await loadCommunity();
    } catch (error) {
      console.error(
        'Comment error:',
        error
      );

      alert(
        error.message ||
          'Unable to add comment.'
      );
    }
  };

  /* =======================================================
     AI
  ======================================================= */

  const askAI = async (
    questionOverride
  ) => {
    if (!requireLogin()) return;

    const question =
      questionOverride !== undefined
        ? questionOverride
        : aiQuestion;

    if (!question.trim()) {
      return;
    }

    try {
      setAiLoading(true);
      setAiError('');
      setAiAnswer('');

      const data =
        await apiFetch(
          '/ai/ask',
          {
            method: 'POST',
            body: JSON.stringify({
              question,
            }),
          },
          authToken
        );

      setAiAnswer(
        data?.answer ||
          data?.message ||
          data?.response ||
          'ClassMate AI did not return an answer.'
      );

      setAiQuestion(question);
    } catch (error) {
      console.error(
        'ClassMate AI error:',
        error
      );

      setAiError(
        error.message ||
          'Unable to connect to ClassMate AI.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  /* =======================================================
     NOTIFICATION READ
  ======================================================= */

  const markNotificationRead = async (
    notification
  ) => {
    if (!requireLogin()) return;

    try {
      await apiFetch(
        `/notifications/${notification.id}/read`,
        {
          method: 'PUT',
        },
        authToken
      );

      setNotifications(
        (current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read: true,
                  isRead: true,
                }
              : item
          )
      );
    } catch (error) {
      console.error(
        'Notification read error:',
        error
      );
    }
  };

  /* =======================================================
     SEARCH
  ======================================================= */

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setSearchLoading(true);

      const data =
        await apiFetch(
          `/search?q=${encodeURIComponent(
            searchQuery.trim()
          )}`
        );

      setSearchResults(data);
    } catch (error) {
      console.error(
        'Search error:',
        error
      );

      setSearchResults({
        error:
          error.message ||
          'Search failed.',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  /* =======================================================
     NOTE HELPERS
  ======================================================= */

  const getNoteIcon = (
    note,
    index
  ) => {
    const title = String(
      note?.title || ''
    ).toLowerCase();

    if (title.includes('math')) {
      return 'fa-square-root-variable';
    }

    if (
      title.includes('science') ||
      title.includes('biology') ||
      title.includes('photosynthesis') ||
      title.includes('respiratory')
    ) {
      return 'fa-seedling';
    }

    if (
      title.includes('english') ||
      title.includes('grammar')
    ) {
      return 'fa-spell-check';
    }

    if (
      title.includes('geography') ||
      title.includes('kenya')
    ) {
      return 'fa-mountain-sun';
    }

    return index % 2 === 0
      ? 'fa-leaf'
      : 'fa-book-open';
  };

  const formatNoteDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return '';
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    return date.toLocaleDateString(
      'en-KE',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  };

  const getNoteMeta = (note) => {
    const subject =
      note?.subject?.name ||
      note?.subjectName ||
      note?.subject ||
      'Learning Resource';

    const grade =
      note?.grade?.name ||
      note?.gradeName ||
      note?.grade ||
      '';

    if (grade) {
      return `${subject} • ${grade}`;
    }

    return subject;
  };

  const displayedNotes =
    notes.slice(0, 5);

  /* =======================================================
     NAVIGATION ITEMS
  ======================================================= */

  const navItems = [
    ['home', 'Home'],
    ['notes', 'Notes'],
    ['past-papers', 'Past Papers'],
    ['quizzes', 'Quizzes'],
    ['print', 'Print & Learn'],
    ['shop', 'Shop'],
    ['ai', 'ClassMate AI'],
    ['community', 'Community'],
    ['learning', 'My Learning'],
    ['contact', 'Contact'],
  ];

  /* =======================================================
     HOME PAGE
  ======================================================= */

  const HomePage = () => (
    <>
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span>Your Future</span>
              <span className="dot"></span>
              <span>Our Mission</span>
            </div>

            <h1 className="hero-title">
              Learn Smarter,
              <br />
              Achieve Bigger
            </h1>

            <p className="hero-desc">
              ClassMate.com is your all-in-one learning
              platform for Grades 1–9 and Secondary.
              Get notes, past papers, quizzes, AI support,
              printables, shop for books, and more — all
              in one place.
            </p>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search for notes, past papers, quizzes, or anything..."
                className="search-input"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter'
                  ) {
                    performSearch();
                    navigateTo('notes');
                  }
                }}
              />

              <button
                type="button"
                className="search-btn"
                onClick={() => {
                  performSearch();
                  navigateTo('notes');
                }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            <div className="popular-searches">
              <span className="search-label">
                Popular searches:
              </span>

              {[
                'Mathematics',
                'Science',
                'English',
                'Grade 7',
                'KCSE',
              ].map((item, index) => (
                <button
                  type="button"
                  key={index}
                  className="search-tag"
                  onClick={() => {
                    setSearchQuery(item);
                    navigateTo('notes');
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-image-container">
            <div className="hero-bg-shape"></div>

            <img
              src="/images/classmate-students-group.png"
              alt="ClassMate students learning together"
              className="hero-img"
            />

            <div className="hero-image-caption">
              <span>Better Students</span>
              <strong>
                Brighter Futures
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="container features-section">
        <div className="features-bar">
          {[
            {
              icon: 'fa-book-open',
              title: 'Study Notes',
              desc: 'Well-organized notes for all subjects and grades.',
              page: 'notes',
            },
            {
              icon: 'fa-file-lines',
              title: 'Past Papers',
              desc: 'Get past papers, revision papers and mark schemes.',
              page: 'past-papers',
            },
            {
              icon: 'fa-circle-question',
              title: 'Quizzes',
              desc: 'Test your knowledge and track your progress.',
              page: 'quizzes',
            },
            {
              icon: 'fa-print',
              title: 'Print & Learn',
              desc: 'Find and print educational materials instantly.',
              page: 'print',
            },
            {
              icon: 'fa-robot',
              title: 'ClassMate AI',
              desc: 'Get instant help with explanations and assignments.',
              page: 'ai',
            },
            {
              icon: 'fa-bag-shopping',
              title: 'Shop',
              desc: 'Buy books, revision materials and more.',
              page: 'shop',
            },
            {
              icon: 'fa-users',
              title: 'Community',
              desc: 'Ask questions, share ideas and learn together.',
              page: 'community',
            },
          ].map((feature, idx) => (
            <button
              type="button"
              className="feature-item"
              key={idx}
              onClick={() =>
                navigateTo(feature.page)
              }
              style={{
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div className="feature-icon">
                <i
                  className={`fa-solid ${feature.icon}`}
                ></i>
              </div>

              <div className="feature-text">
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="container levels-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Explore by Education Level
            </h2>

            <p className="section-subtitle">
              Choose your level and start learning today.
            </p>
          </div>
        </div>

        <div className="levels-grid">
          {[
            {
              icon: 'fa-child',
              title: 'Primary',
              sub: '(Grade 1 – 6)',
            },
            {
              icon: 'fa-user-graduate',
              title: 'Junior School',
              sub: '(Grade 7 – 9)',
            },
            {
              icon: 'fa-user-tie',
              title: 'Secondary',
              sub: '(Form 1 – 4)',
            },
            {
              icon: 'fa-box-open',
              title: 'More Levels Coming Soon',
              sub: '(College, University, TVET & Professional)',
            },
          ].map((level, idx) => (
            <div
              className="level-card"
              key={idx}
            >
              <div className="level-icon">
                <i
                  className={`fa-solid ${level.icon}`}
                ></i>
              </div>

              <h3>{level.title}</h3>

              <p>{level.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container content-grid-section">
        <div className="content-grid">
          <div className="card resources-card">
            <div className="card-header">
              <h3>Latest Resources</h3>

              <div
                className="tabs"
                role="tablist"
              >
                <button
                  type="button"
                  className="tab active"
                  onClick={() =>
                    navigateTo('notes')
                  }
                >
                  Notes
                </button>

                <button
                  type="button"
                  className="tab"
                  onClick={() =>
                    navigateTo(
                      'past-papers'
                    )
                  }
                >
                  Past Papers
                </button>

                <button
                  type="button"
                  className="tab"
                  onClick={() =>
                    navigateTo('quizzes')
                  }
                >
                  Quizzes
                </button>
              </div>
            </div>

            <div className="resources-list">
              {loadingNotes && (
                <div className="resource-item">
                  <div className="res-icon">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  </div>

                  <div className="res-info">
                    <h4>
                      Loading ClassMate notes...
                    </h4>

                    <p>
                      Connecting to the ClassMate
                      learning server.
                    </p>
                  </div>
                </div>
              )}

              {!loadingNotes &&
                notesError && (
                  <div className="resource-item">
                    <div className="res-icon">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <div className="res-info">
                      <h4>
                        Notes temporarily
                        unavailable
                      </h4>

                      <p>
                        {notesError}
                      </p>
                    </div>
                  </div>
                )}

              {!loadingNotes &&
                !notesError &&
                displayedNotes.length ===
                  0 && (
                  <div className="resource-item">
                    <div className="res-icon">
                      <i className="fa-solid fa-book-open"></i>
                    </div>

                    <div className="res-info">
                      <h4>
                        No notes available yet
                      </h4>

                      <p>
                        New ClassMate learning
                        resources will appear
                        here.
                      </p>
                    </div>
                  </div>
                )}

              {!loadingNotes &&
                !notesError &&
                displayedNotes.map(
                  (note, idx) => (
                    <div
                      className="resource-item"
                      key={
                        note.id || idx
                      }
                    >
                      <div className="res-icon">
                        <i
                          className={`fa-solid ${getNoteIcon(
                            note,
                            idx
                          )}`}
                        ></i>
                      </div>

                      <div className="res-info">
                        <h4>
                          {note.title ||
                            'ClassMate Learning Note'}
                        </h4>

                        <p>
                          {getNoteMeta(note)}
                        </p>
                      </div>

                      <div className="res-action">
                        <span>
                          {formatNoteDate(
                            note.createdAt ||
                              note.updatedAt ||
                              note.date
                          )}
                        </span>

                        <i className="fa-solid fa-download"></i>
                      </div>
                    </div>
                  )
                )}
            </div>

            <div className="card-footer">
              <button
                type="button"
                className="view-all-link"
                onClick={() =>
                  navigateTo('notes')
                }
              >
                View All Notes
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="card ai-card">
            <div className="ai-header">
              <div className="ai-avatar">
                <i className="fa-solid fa-robot"></i>
              </div>

              <div>
                <div className="ai-title-row">
                  <h3>ClassMate AI</h3>

                  <span className="beta-tag">
                    Beta
                  </span>
                </div>

                <p className="ai-sub">
                  Ask anything, get instant help!
                </p>
              </div>
            </div>

            <div className="chat-bubbles">
              {[
                [
                  'fa-regular fa-lightbulb',
                  'Explain photosynthesis in simple terms',
                ],
                [
                  'fa-solid fa-calculator',
                  'Help me with Grade 7 math questions',
                ],
                [
                  'fa-solid fa-paw',
                  'What are the parts of an animal?',
                ],
                [
                  'fa-solid fa-file-lines',
                  'Summarize this topic for me',
                ],
              ].map(
                ([icon, textValue], index) => (
                  <button
                    type="button"
                    className="chat-bubble"
                    key={index}
                    onClick={() => {
                      setAiQuestion(
                        textValue
                      );
                      navigateTo('ai');
                    }}
                  >
                    <i
                      className={icon}
                    ></i>
                    {textValue}
                  </button>
                )
              )}
            </div>

            <div className="ai-input-area">
              <div className="ai-bot-graphic">
                <div className="ai-bot-face">
                  <i className="fa-solid fa-robot"></i>
                </div>
              </div>

              <div className="ai-input-wrapper">
                <input
                  type="text"
                  placeholder="Type your question here..."
                  value={aiQuestion}
                  onChange={(event) =>
                    setAiQuestion(
                      event.target.value
                    )
                  }
                  onFocus={() =>
                    navigateTo('ai')
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      'Enter'
                    ) {
                      askAI();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    askAI()
                  }
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="card shop-card">
            <div className="card-header">
              <h3>Shop Featured</h3>

              <button
                type="button"
                className="view-all-link small"
                onClick={() =>
                  navigateTo('shop')
                }
              >
                View All
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            {loadingProducts ? (
              <div
                className="product-image-container"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '250px',
                }}
              >
                <i className="fa-solid fa-spinner fa-spin"></i>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="product-image-container">
                  <span className="best-seller">
                    BEST SELLER
                  </span>

                  <img
                    src={
                      products[0]?.imageUrl ||
                      products[0]?.image ||
                      products[0]?.photo ||
                      products[0]?.thumbnail ||
                      '/images/Colorful ClassMate Grade 5 Textbooks.png'
                    }
                    alt={
                      products[0]?.name ||
                      products[0]?.title ||
                      'ClassMate study book'
                    }
                    onError={(event) => {
                      event.currentTarget.src =
                        '/images/Colorful ClassMate Grade 5 Textbooks.png';
                    }}
                  />
                </div>

                <h4 className="product-title">
                  {products[0]?.name ||
                    products[0]?.title ||
                    'ClassMate Learning Book'}
                </h4>

                <p className="product-meta">
                  {products[0]?.description ||
                    'ClassMate educational learning material'}
                </p>

                <p className="product-price">
                  KSh{' '}
                  {Number(
                    products[0]?.price ||
                      products[0]
                        ?.sellingPrice ||
                      0
                  ).toLocaleString(
                    'en-KE'
                  )}
                </p>

                <button
                  type="button"
                  className="btn btn-primary full-width add-to-cart"
                  onClick={() =>
                    addToCart(
                      products[0]
                    )
                  }
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                  Add to Cart
                </button>
              </>
            ) : (
              <>
                <div className="product-image-container">
                  <span className="best-seller">
                    COMING SOON
                  </span>

                  <img
                    src="/images/Colorful ClassMate Grade 5 Textbooks.png"
                    alt="ClassMate study books"
                  />
                </div>

                <h4 className="product-title">
                  ClassMate Study Books
                </h4>

                <p className="product-meta">
                  Books and revision materials
                </p>

                <p className="product-price">
                  Shop products coming soon
                </p>

                <button
                  type="button"
                  className="btn btn-primary full-width"
                  onClick={() =>
                    navigateTo('shop')
                  }
                >
                  Open Shop
                </button>
              </>
            )}

            <div className="delivery-info">
              <p className="delivery-title">
                Delivery Across Kenya
              </p>

              <ul>
                <li>
                  <i className="fa-solid fa-truck-fast"></i>
                  Fast & Reliable
                </li>

                <li>
                  <i className="fa-solid fa-shield-halved"></i>
                  Secure Payments
                </li>

                <li>
                  <i className="fa-solid fa-location-dot"></i>
                  Track Your Order
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container community-section">
        <div className="community-banner">
          <div className="comm-content">
            <h2>Join Our Community</h2>

            <p>
              Ask questions, share notes, get help and
              learn from other students across the country.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigateTo('community')
              }
            >
              Join Now
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="comm-image">
            <img
              src="/images/classmate-student-laptop.png"
              alt="Students collaborating"
            />
          </div>

          <div className="comm-quote">
            <i className="fa-solid fa-quote-left"></i>

            <p>
              "ClassMate has made my studies so much
              easier. I love the AI assistant and the
              printable resources!"
            </p>

            <span>— A Happy Student</span>
          </div>
        </div>
      </section>

      <section className="container bottom-links-section">
        <div className="bottom-links-grid">
          {[
            {
              icon: 'fa-gift',
              title: 'Free Resources',
              desc: 'Get access to free notes, quizzes and printables.',
              page: 'notes',
            },
            {
              icon: 'fa-box',
              title: 'Study Bundles',
              desc: 'Save more with our curated bundles.',
              page: 'shop',
            },
            {
              icon: 'fa-chalkboard-user',
              title: 'Teacher Zone',
              desc: 'Tools and resources for teachers.',
              page: 'learning',
            },
            {
              icon: 'fa-users-viewfinder',
              title: 'Parent Corner',
              desc: "Track your child's progress and get support.",
              page: 'learning',
            },
            {
              icon: 'fa-headset',
              title: 'Need Help?',
              desc: 'Visit our help center or contact us.',
              page: 'contact',
            },
          ].map((link, idx) => (
            <button
              type="button"
              className="bottom-link-card"
              key={idx}
              onClick={() =>
                navigateTo(link.page)
              }
            >
              <i
                className={`fa-solid ${link.icon}`}
              ></i>

              <div>
                <h4>{link.title}</h4>
                <p>{link.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );

  /* =======================================================
     NOTES PAGE
  ======================================================= */

  const NotesPage = () => (
    <>
      <PageHeader
        title="Study Notes"
        subtitle="Find organized learning notes for your grade and subjects."
        icon="fa-book-open"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        {loadingNotes && (
          <div
            className="card"
            style={{
              padding: '45px',
              textAlign: 'center',
            }}
          >
            <i className="fa-solid fa-spinner fa-spin"></i>
            <h3>Loading notes...</h3>
          </div>
        )}

        {!loadingNotes && notesError && (
          <div
            className="card"
            style={{
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <i className="fa-solid fa-triangle-exclamation"></i>
            <h3>Notes temporarily unavailable</h3>
            <p>{notesError}</p>
          </div>
        )}

        {!loadingNotes &&
          !notesError &&
          notes.length === 0 && (
            <div
              className="card"
              style={{
                padding: '45px',
                textAlign: 'center',
              }}
            >
              <h3>No notes available yet.</h3>
            </div>
          )}

        {!loadingNotes &&
          !notesError &&
          notes.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {notes.map((note, index) => (
                <div
                  className="card"
                  key={note.id || index}
                  style={{ padding: '25px' }}
                >
                  <div className="feature-icon">
                    <i
                      className={`fa-solid ${getNoteIcon(
                        note,
                        index
                      )}`}
                    ></i>
                  </div>

                  <h3 style={{ marginTop: '15px' }}>
                    {note.title ||
                      'ClassMate Learning Note'}
                  </h3>

                  <p>
                    {getNoteMeta(note)}
                  </p>

                  {note.content && (
                    <p
                      style={{
                        marginTop: '12px',
                      }}
                    >
                      {String(
                        note.content
                      ).slice(
                        0,
                        180
                      )}
                      {String(
                        note.content
                      ).length > 180
                        ? '...'
                        : ''}
                    </p>
                  )}

                  <p
                    style={{
                      marginTop: '12px',
                      fontSize: '13px',
                    }}
                  >
                    {formatNoteDate(
                      note.createdAt ||
                        note.updatedAt
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
      </section>
    </>
  );

  /* =======================================================
     PAST PAPERS PAGE
  ======================================================= */

  const PastPapersPage = () => (
    <>
      <PageHeader
        title="Past Papers"
        subtitle="Practice with revision papers and examination questions."
        icon="fa-file-lines"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        {loadingPastPapers && (
          <div
            className="card"
            style={{
              padding: '45px',
              textAlign: 'center',
            }}
          >
            <i className="fa-solid fa-spinner fa-spin"></i>
            <h3>Loading past papers...</h3>
          </div>
        )}

        {!loadingPastPapers &&
          pastPapersError && (
            <div
              className="card"
              style={{
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <i className="fa-solid fa-triangle-exclamation"></i>
              <h3>
                Past papers temporarily unavailable
              </h3>
              <p>{pastPapersError}</p>
            </div>
          )}

        {!loadingPastPapers &&
          !pastPapersError &&
          pastPapers.length === 0 && (
            <div
              className="card"
              style={{
                padding: '45px',
                textAlign: 'center',
              }}
            >
              <h3>
                No past papers available yet.
              </h3>
            </div>
          )}

        {!loadingPastPapers &&
          !pastPapersError &&
          pastPapers.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {pastPapers.map(
                (paper, index) => (
                  <div
                    className="card"
                    key={
                      paper.id ||
                      index
                    }
                    style={{
                      padding: '25px',
                    }}
                  >
                    <div className="feature-icon">
                      <i className="fa-solid fa-file-lines"></i>
                    </div>

                    <h3
                      style={{
                        marginTop:
                          '15px',
                      }}
                    >
                      {paper.title ||
                        'Past Paper'}
                    </h3>

                    <p>
                      {paper.year
                        ? `Year: ${paper.year}`
                        : 'Revision paper'}
                    </p>

                    {paper.examType && (
                      <p>
                        Exam type:{' '}
                        {paper.examType}
                      </p>
                    )}

                    {paper.fileUrl && (
                      <a
                        href={paper.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{
                          display:
                            'inline-block',
                          marginTop:
                            '15px',
                        }}
                      >
                        Open Paper
                      </a>
                    )}

                    {paper.markingUrl && (
                      <a
                        href={
                          paper.markingUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                        style={{
                          display:
                            'inline-block',
                          marginTop:
                            '10px',
                          marginLeft:
                            '10px',
                        }}
                      >
                        Marking Scheme
                      </a>
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </section>
    </>
  );

  /* =======================================================
     QUIZZES PAGE
  ======================================================= */

  const QuizzesPage = () => (
    <>
      <PageHeader
        title="Quizzes"
        subtitle="Test yourself and build your confidence."
        icon="fa-circle-question"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        {activeQuiz ? (
          <div
            className="card"
            style={{ padding: '30px' }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setActiveQuiz(null);
                setActiveQuizAttempt(null);
                setQuizResult(null);
              }}
            >
              ← Back to Quizzes
            </button>

            <h2 style={{ marginTop: '25px' }}>
              {activeQuiz.title}
            </h2>

            <p>
              {activeQuiz.description ||
                'Complete this ClassMate quiz.'}
            </p>

            {quizResult ? (
              <div
                style={{
                  marginTop: '25px',
                  padding: '25px',
                  borderRadius: '12px',
                }}
              >
                <h3>
                  Quiz Completed
                </h3>

                <p>
                  Score:{' '}
                  {quizResult.score ??
                    '—'}
                </p>

                <p>
                  Percentage:{' '}
                  {quizResult.percentage ??
                    quizResult.progressPercentage ??
                    '—'}
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    marginTop: '25px',
                    padding: '20px',
                  }}
                >
                  <p>
                    Your quiz attempt has
                    started. Questions from
                    the selected quiz will
                    appear here when supplied
                    by the backend.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      quizSubmitting
                    }
                    onClick={
                      submitQuiz
                    }
                  >
                    {quizSubmitting
                      ? 'Submitting...'
                      : 'Submit Quiz'}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {loadingQuizzes && (
              <div
                className="card"
                style={{
                  padding: '45px',
                  textAlign:
                    'center',
                }}
              >
                <i className="fa-solid fa-spinner fa-spin"></i>
                <h3>
                  Loading quizzes...
                </h3>
              </div>
            )}

            {!loadingQuizzes &&
              quizzesError && (
                <div
                  className="card"
                  style={{
                    padding: '40px',
                    textAlign:
                      'center',
                  }}
                >
                  <h3>
                    Quizzes temporarily
                    unavailable
                  </h3>
                  <p>
                    {quizzesError}
                  </p>
                </div>
              )}

            {!loadingQuizzes &&
              !quizzesError &&
              quizzes.length ===
                0 && (
                <div
                  className="card"
                  style={{
                    padding: '45px',
                    textAlign:
                      'center',
                  }}
                >
                  <h3>
                    No quizzes available
                    yet.
                  </h3>
                </div>
              )}

            {!loadingQuizzes &&
              !quizzesError &&
              quizzes.length >
                0 && (
                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {quizzes.map(
                    (quiz, index) => (
                      <div
                        className="card"
                        key={
                          quiz.id ||
                          index
                        }
                        style={{
                          padding:
                            '25px',
                        }}
                      >
                        <div className="feature-icon">
                          <i className="fa-solid fa-circle-question"></i>
                        </div>

                        <h3
                          style={{
                            marginTop:
                              '15px',
                          }}
                        >
                          {quiz.title ||
                            'ClassMate Quiz'}
                        </h3>

                        <p>
                          {quiz.description ||
                            'Test your knowledge with ClassMate.'}
                        </p>

                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{
                            marginTop:
                              '15px',
                          }}
                          onClick={() =>
                            startQuiz(
                              quiz
                            )
                          }
                        >
                          Start Quiz
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
          </>
        )}
      </section>
    </>
  );

  /* =======================================================
     PRINTABLES PAGE
  ======================================================= */

  const PrintablesPage = () => (
    <>
      <PageHeader
        title="Print & Learn"
        subtitle="Find educational resources that you can print and use."
        icon="fa-print"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        {loadingPrintables && (
          <div
            className="card"
            style={{
              padding: '45px',
              textAlign: 'center',
            }}
          >
            <i className="fa-solid fa-spinner fa-spin"></i>
            <h3>
              Loading printable resources...
            </h3>
          </div>
        )}

        {!loadingPrintables &&
          printablesError && (
            <div
              className="card"
              style={{
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <h3>
                Printables temporarily
                unavailable
              </h3>
              <p>
                {printablesError}
              </p>
            </div>
          )}

        {!loadingPrintables &&
          !printablesError &&
          printables.length ===
            0 && (
            <div
              className="card"
              style={{
                padding: '45px',
                textAlign: 'center',
              }}
            >
              <h3>
                No printable resources available
                yet.
              </h3>
            </div>
          )}

        {!loadingPrintables &&
          !printablesError &&
          printables.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {printables.map(
                (item, index) => (
                  <div
                    className="card"
                    key={
                      item.id ||
                      index
                    }
                    style={{
                      padding:
                        '25px',
                    }}
                  >
                    <div className="feature-icon">
                      <i className="fa-solid fa-print"></i>
                    </div>

                    <h3
                      style={{
                        marginTop:
                          '15px',
                      }}
                    >
                      {item.title ||
                        item.name ||
                        'Printable Resource'}
                    </h3>

                    <p>
                      {item.description ||
                        item.content ||
                        'ClassMate printable learning material.'}
                    </p>

                    {item.fileUrl && (
                      <a
                        href={
                          item.fileUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{
                          display:
                            'inline-block',
                          marginTop:
                            '15px',
                        }}
                      >
                        Open Printable
                      </a>
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </section>
    </>
  );

  /* =======================================================
     AI PAGE
  ======================================================= */

  const AIPage = () => (
    <>
      <PageHeader
        title="ClassMate AI"
        subtitle="Your learning assistant is here to help."
        icon="fa-robot"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        <div
          className="card"
          style={{
            padding: '30px',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <div className="ai-header">
            <div className="ai-avatar">
              <i className="fa-solid fa-robot"></i>
            </div>

            <div>
              <div className="ai-title-row">
                <h3>ClassMate AI</h3>

                <span className="beta-tag">
                  Beta
                </span>
              </div>

              <p className="ai-sub">
                Ask questions and get help with
                your learning.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '25px',
            }}
          >
            <textarea
              value={aiQuestion}
              onChange={(event) =>
                setAiQuestion(
                  event.target.value
                )
              }
              placeholder="Ask ClassMate AI a question..."
              style={{
                width: '100%',
                minHeight: '130px',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid #d5ddd7',
                resize: 'vertical',
              }}
            />

            <button
              type="button"
              className="btn btn-primary"
              style={{
                marginTop: '15px',
              }}
              disabled={aiLoading}
              onClick={() =>
                askAI()
              }
            >
              {aiLoading
                ? 'Thinking...'
                : 'Ask ClassMate AI'}
            </button>
          </div>

          {aiError && (
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
              }}
            >
              {aiError}
            </div>
          )}

          {aiAnswer && (
            <div
              className="card"
              style={{
                marginTop: '25px',
                padding: '25px',
              }}
            >
              <h3>ClassMate AI Answer</h3>

              <p
                style={{
                  whiteSpace:
                    'pre-wrap',
                  marginTop: '15px',
                }}
              >
                {aiAnswer}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );

  /* =======================================================
     COMMUNITY PAGE
  ======================================================= */

  const CommunityPage = () => (
    <>
      <PageHeader
        title="ClassMate Community"
        subtitle="Learn, ask questions and connect with other learners."
        icon="fa-users"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        {isLoggedIn && (
          <form
            className="card"
            onSubmit={
              createCommunityPost
            }
            style={{
              padding: '25px',
              marginBottom: '25px',
            }}
          >
            <h3>
              Start a Discussion
            </h3>

            <input
              type="text"
              placeholder="Post title"
              value={newPost.title}
              onChange={(event) =>
                setNewPost({
                  ...newPost,
                  title:
                    event.target.value,
                })
              }
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '15px',
              }}
            />

            <textarea
              placeholder="What would you like to share or ask?"
              value={newPost.content}
              onChange={(event) =>
                setNewPost({
                  ...newPost,
                  content:
                    event.target.value,
                })
              }
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                marginTop: '12px',
              }}
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                communitySubmitting
              }
              style={{
                marginTop: '15px',
              }}
            >
              {communitySubmitting
                ? 'Posting...'
                : 'Post to Community'}
            </button>
          </form>
        )}

        {!isLoggedIn && (
          <div
            className="card"
            style={{
              padding: '25px',
              marginBottom: '25px',
              textAlign: 'center',
            }}
          >
            <h3>
              Join the ClassMate Community
            </h3>

            <p>
              Login to ask questions, create
              discussions, comment and like posts.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                openAuth('login')
              }
            >
              Login to Continue
            </button>
          </div>
        )}

        {loadingCommunity && (
          <div
            className="card"
            style={{
              padding: '45px',
              textAlign: 'center',
            }}
          >
            <i className="fa-solid fa-spinner fa-spin"></i>
            <h3>
              Loading community...
            </h3>
          </div>
        )}

        {!loadingCommunity &&
          communityError && (
            <div
              className="card"
              style={{
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <h3>
                Community temporarily
                unavailable
              </h3>
              <p>
                {communityError}
              </p>
            </div>
          )}

        {!loadingCommunity &&
          !communityError &&
          communityPosts.length ===
            0 && (
            <div
              className="card"
              style={{
                padding: '45px',
                textAlign: 'center',
              }}
            >
              <h3>
                No community posts yet.
              </h3>
            </div>
          )}

        {!loadingCommunity &&
          !communityError &&
          communityPosts.length >
            0 && (
            <div
              style={{
                display: 'grid',
                gap: '20px',
              }}
            >
              {communityPosts.map(
                (post, index) => (
                  <div
                    className="card"
                    key={
                      post.id ||
                      index
                    }
                    style={{
                      padding:
                        '25px',
                    }}
                  >
                    <h3>
                      {post.title ||
                        'ClassMate Discussion'}
                    </h3>

                    <p
                      style={{
                        marginTop:
                          '10px',
                        whiteSpace:
                          'pre-wrap',
                      }}
                    >
                      {post.content}
                    </p>

                    <div
                      style={{
                        marginTop:
                          '15px',
                        display:
                          'flex',
                        gap: '15px',
                        alignItems:
                          'center',
                        flexWrap:
                          'wrap',
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() =>
                          toggleLike(
                            post
                          )
                        }
                      >
                        <i className="fa-solid fa-heart"></i>{' '}
                        Like
                      </button>

                      <span>
                        Likes:{' '}
                        {post.likeCount ??
                          post.likesCount ??
                          0}
                      </span>
                    </div>

                    {post.comments?.length >
                      0 && (
                      <div
                        style={{
                          marginTop:
                            '20px',
                        }}
                      >
                        {post.comments.map(
                          (
                            comment
                          ) => (
                            <div
                              key={
                                comment.id
                              }
                              style={{
                                padding:
                                  '12px 0',
                              }}
                            >
                              <strong>
                                {comment.user
                                  ?.firstName ||
                                  comment.author
                                    ?.firstName ||
                                  'ClassMate User'}
                              </strong>

                              <p>
                                {
                                  comment.content
                                }
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {isLoggedIn && (
                      <div
                        style={{
                          display:
                            'flex',
                          gap: '10px',
                          marginTop:
                            '15px',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={
                            commentInputs[
                              post.id
                            ] || ''
                          }
                          onChange={(
                            event
                          ) =>
                            setCommentInputs(
                              (
                                current
                              ) => ({
                                ...current,
                                [post.id]:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          style={{
                            flex: 1,
                            padding:
                              '10px',
                          }}
                        />

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            addComment(
                              post.id
                            )
                          }
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </section>
    </>
  );

  /* =======================================================
     MY LEARNING PAGE
  ======================================================= */

  const LearningPage = () => (
    <>
      <PageHeader
        title="My Learning"
        subtitle="Track your learning activity and progress."
        icon="fa-chart-line"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        {!isLoggedIn ? (
          <div
            className="card"
            style={{
              padding: '45px',
              textAlign: 'center',
            }}
          >
            <h3>
              Login to view your learning
              dashboard.
            </h3>

            <button
              type="button"
              className="btn btn-primary"
              style={{
                marginTop: '15px',
              }}
              onClick={() =>
                openAuth('login')
              }
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
              }}
            >
              <div
                className="card"
                style={{
                  padding: '25px',
                }}
              >
                <div className="feature-icon">
                  <i className="fa-solid fa-user"></i>
                </div>

                <h3>
                  {user?.firstName ||
                    user?.name ||
                    'Student'}
                </h3>

                <p>
                  {user?.email}
                </p>
              </div>

              <div
                className="card"
                style={{
                  padding: '25px',
                }}
              >
                <div className="feature-icon">
                  <i className="fa-solid fa-chart-line"></i>
                </div>

                <h3>
                  Progress
                </h3>

                <p>
                  {loadingProgress
                    ? 'Loading...'
                    : `${progress.length} progress records`}
                </p>
              </div>

              <div
                className="card"
                style={{
                  padding: '25px',
                }}
              >
                <div className="feature-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>

                <h3>
                  Quiz Attempts
                </h3>

                <p>
                  {quizAttempts.length}
                </p>
              </div>

              <div
                className="card"
                style={{
                  padding: '25px',
                }}
              >
                <div className="feature-icon">
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>

                <h3>
                  Orders
                </h3>

                <p>
                  {orders.length}
                </p>
              </div>
            </div>

            {studentProfile && (
              <div
                className="card"
                style={{
                  marginTop: '25px',
                  padding: '25px',
                }}
              >
                <h3>
                  My Profile
                </h3>

                <p>
                  Education Level:{' '}
                  {studentProfile.educationLevel ||
                    'Not set'}
                </p>

                <p>
                  Grade:{' '}
                  {studentProfile.grade
                    ?.name ||
                    studentProfile.gradeName ||
                    'Not set'}
                </p>
              </div>
            )}

            <div
              className="card"
              style={{
                marginTop: '25px',
                padding: '25px',
              }}
            >
              <h3>
                My Orders
              </h3>

              {loadingOrders ? (
                <p>
                  Loading orders...
                </p>
              ) : orders.length ===
                0 ? (
                <p>
                  You have no orders yet.
                </p>
              ) : (
                orders.map(
                  (order, index) => (
                    <div
                      key={
                        order.id ||
                        index
                      }
                      style={{
                        padding:
                          '15px 0',
                      }}
                    >
                      <strong>
                        Order #
                        {order.id}
                      </strong>

                      <p>
                        Status:{' '}
                        {order.status ||
                          'Pending'}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </>
        )}
      </section>
    </>
  );

  /* =======================================================
     CONTACT PAGE
  ======================================================= */

  const ContactPage = () => (
    <>
      <PageHeader
        title="Contact ClassMate"
        subtitle="We're here to help."
        icon="fa-headset"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        <div
          className="card"
          style={{
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <div className="feature-icon">
            <i className="fa-solid fa-headset"></i>
          </div>

          <h2
            style={{
              marginTop: '20px',
            }}
          >
            Need Help?
          </h2>

          <p
            style={{
              maxWidth: '650px',
              margin:
                '15px auto',
            }}
          >
            Contact the ClassMate team for support,
            questions, feedback, partnerships and
            other enquiries.
          </p>

          <div
            style={{
              marginTop: '25px',
              display: 'grid',
              gap: '12px',
            }}
          >
            <p>
              <i className="fa-regular fa-envelope"></i>{' '}
              support@classmate.com
            </p>

            <p>
              <i className="fa-solid fa-phone"></i>{' '}
              +254 700 123 456
            </p>

            <p>
              <i className="fa-solid fa-location-dot"></i>{' '}
              Kenya • Africa
            </p>
          </div>
        </div>
      </section>
    </>
  );

  /* =======================================================
     SEARCH RESULTS
  ======================================================= */

  const SearchResultsPage = () => (
    <>
      <PageHeader
        title="Search Results"
        subtitle={`Results for "${searchQuery}"`}
        icon="fa-magnifying-glass"
      />

      <section
        className="container"
        style={{ paddingBottom: '70px' }}
      >
        {searchLoading && (
          <div
            className="card"
            style={{
              padding: '40px',
              textAlign: 'center',
            }}
          >
            Searching ClassMate...
          </div>
        )}

        {!searchLoading &&
          searchResults && (
            <div
              className="card"
              style={{
                padding: '30px',
              }}
            >
              <pre
                style={{
                  whiteSpace:
                    'pre-wrap',
                  overflowX:
                    'auto',
                }}
              >
                {JSON.stringify(
                  searchResults,
                  null,
                  2
                )}
              </pre>
            </div>
          )}
      </section>
    </>
  );

  /* =======================================================
     RENDER PAGE
  ======================================================= */

  const renderPage = () => {
    if (currentPage === 'home') {
      return <HomePage />;
    }

    if (currentPage === 'notes') {
      return <NotesPage />;
    }

    if (
      currentPage ===
      'past-papers'
    ) {
      return <PastPapersPage />;
    }

    if (currentPage === 'quizzes') {
      return <QuizzesPage />;
    }

    if (currentPage === 'print') {
      return <PrintablesPage />;
    }

    if (currentPage === 'shop') {
      return (
        <ShopPage
          products={products}
          loadingProducts={
            loadingProducts
          }
          productsError={
            productsError
          }
          onAddToCart={addToCart}
          cartCount={cartCount}
          onGoHome={() =>
            navigateTo('home')
          }
          onCheckout={checkout}
          isLoggedIn={isLoggedIn}
        />
      );
    }

    if (currentPage === 'ai') {
      return <AIPage />;
    }

    if (
      currentPage ===
      'community'
    ) {
      return <CommunityPage />;
    }

    if (
      currentPage ===
      'learning'
    ) {
      return <LearningPage />;
    }

    if (
      currentPage ===
      'contact'
    ) {
      return <ContactPage />;
    }

    if (
      currentPage ===
      'search'
    ) {
      return <SearchResultsPage />;
    }

    return <HomePage />;
  };

  /* =======================================================
     APP RETURN
  ======================================================= */

  return (
    <div className="app-wrapper">
      {/* HEADER */}

      <header className="header">
        <div className="container header-inner">
          <button
            type="button"
            onClick={() =>
              navigateTo('home')
            }
            style={{
              border: 'none',
              background:
                'transparent',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <BrandLogo />
          </button>

          <nav className="main-nav">
            {navItems.map(
              ([page, label]) => (
                <button
                  type="button"
                  key={page}
                  className={`nav-link ${
                    currentPage === page
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    navigateTo(page)
                  }
                >
                  {label}
                </button>
              )
            )}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn"
              aria-label="Search"
              onClick={() => {
                if (
                  searchQuery.trim()
                ) {
                  performSearch();
                  navigateTo(
                    'search'
                  );
                } else {
                  navigateTo(
                    'notes'
                  );
                }
              }}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            <button
              type="button"
              className="icon-btn notification-btn"
              aria-label="Notifications"
              onClick={() =>
                isLoggedIn
                  ? navigateTo(
                      'learning'
                    )
                  : openAuth(
                      'login'
                    )
              }
            >
              <i className="fa-regular fa-bell"></i>

              {notifications.filter(
                (item) =>
                  !item.read &&
                  !item.isRead
              ).length > 0 && (
                <span className="badge">
                  {
                    notifications.filter(
                      (item) =>
                        !item.read &&
                        !item.isRead
                    ).length
                  }
                </span>
              )}
            </button>

            <div className="auth-buttons">
              {isLoggedIn ? (
                <>
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {user?.firstName ||
                      user?.name ||
                      user?.email ||
                      'Student'}
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={
                      logout
                    }
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() =>
                      openAuth(
                        'login'
                      )
                    }
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      openAuth(
                        'register'
                      )
                    }
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* AUTH MODAL */}

      {authMode && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            padding: '20px',
            zIndex: 9999,
          }}
          onClick={closeAuth}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '30px',
              position:
                'relative',
              maxHeight:
                '90vh',
              overflowY:
                'auto',
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              aria-label="Close"
              onClick={
                closeAuth
              }
              style={{
                position:
                  'absolute',
                top: '15px',
                right: '15px',
                border: 'none',
                background:
                  'transparent',
                fontSize: '22px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>

            <BrandLogo />

            <h2
              style={{
                marginTop:
                  '25px',
                marginBottom:
                  '8px',
              }}
            >
              {authMode ===
              'login'
                ? 'Welcome Back'
                : 'Create Your ClassMate Account'}
            </h2>

            <p
              style={{
                marginBottom:
                  '20px',
              }}
            >
              {authMode ===
              'login'
                ? 'Login to continue learning.'
                : 'Join ClassMate and start learning smarter.'}
            </p>

            <form
              onSubmit={
                handleAuthSubmit
              }
            >
              {authMode ===
                'register' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <input
                    required
                    type="text"
                    placeholder="First name"
                    value={
                      authForm.firstName
                    }
                    onChange={(
                      event
                    ) =>
                      setAuthForm(
                        {
                          ...authForm,
                          firstName:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                    style={{
                      padding:
                        '12px',
                      width: '100%',
                    }}
                  />

                  <input
                    required
                    type="text"
                    placeholder="Last name"
                    value={
                      authForm.lastName
                    }
                    onChange={(
                      event
                    ) =>
                      setAuthForm(
                        {
                          ...authForm,
                          lastName:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                    style={{
                      padding:
                        '12px',
                      width: '100%',
                    }}
                  />
                </div>
              )}

              <input
                required
                type="email"
                placeholder="Email address"
                value={
                  authForm.email
                }
                onChange={(
                  event
                ) =>
                  setAuthForm({
                    ...authForm,
                    email:
                      event.target
                        .value,
                  })
                }
                style={{
                  padding:
                    '12px',
                  width: '100%',
                  marginTop:
                    authMode ===
                    'register'
                      ? '12px'
                      : 0,
                }}
              />

              <input
                required
                type="password"
                placeholder="Password"
                value={
                  authForm.password
                }
                onChange={(
                  event
                ) =>
                  setAuthForm({
                    ...authForm,
                    password:
                      event.target
                        .value,
                  })
                }
                style={{
                  padding:
                    '12px',
                  width: '100%',
                  marginTop:
                    '12px',
                }}
              />

              {authError && (
                <p
                  style={{
                    marginTop:
                      '12px',
                    color:
                      '#b42318',
                  }}
                >
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary full-width"
                disabled={
                  authLoading
                }
                style={{
                  marginTop:
                    '18px',
                }}
              >
                {authLoading
                  ? 'Please wait...'
                  : authMode ===
                    'login'
                  ? 'Login'
                  : 'Create Account'}
              </button>
            </form>

            <p
              style={{
                textAlign:
                  'center',
                marginTop:
                  '18px',
              }}
            >
              {authMode ===
              'login'
                ? "Don't have an account?"
                : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() =>
                  openAuth(
                    authMode ===
                      'login'
                      ? 'register'
                      : 'login'
                  )
                }
                style={{
                  border:
                    'none',
                  background:
                    'transparent',
                  fontWeight: 700,
                  cursor:
                    'pointer',
                }}
              >
                {authMode ===
                'login'
                  ? 'Sign Up'
                  : 'Login'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* PAGE */}

      {renderPage()}

      {/* FOOTER */}

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="footer-student-image">
              <img
                src="/images/Graduates Celebrating Under Flying Caps.png"
                alt="ClassMate learning resources"
              />

              <div className="footer-image-overlay">
                Learn • Grow • Succeed
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigateTo('home')
              }
              style={{
                border: 'none',
                background:
                  'transparent',
                padding: 0,
                cursor:
                  'pointer',
              }}
            >
              <BrandLogo footer />
            </button>

            <p className="footer-desc">
              Empowering students across Kenya and
              Africa with quality resources, smart tools
              and a supportive learning community.
            </p>

            <div className="social-icons">
              {[
                'facebook-f',
                'instagram',
                'tiktok',
                'x-twitter',
                'youtube',
                'whatsapp',
              ].map(
                (social, idx) => (
                  <a
                    href="#"
                    key={idx}
                    onClick={(
                      event
                    ) =>
                      event.preventDefault()
                    }
                  >
                    <i
                      className={`fa-brands fa-${social}`}
                    ></i>
                  </a>
                )
              )}
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>

            <ul>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo('home')
                  }
                >
                  Home
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo('notes')
                  }
                >
                  Notes
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'past-papers'
                    )
                  }
                >
                  Past Papers
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'quizzes'
                    )
                  }
                >
                  Quizzes
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'print'
                    )
                  }
                >
                  Print & Learn
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>&nbsp;</h4>

            <ul>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo('shop')
                  }
                >
                  Shop
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo('ai')
                  }
                >
                  ClassMate AI
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'community'
                    )
                  }
                >
                  Community
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'learning'
                    )
                  }
                >
                  My Learning
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'contact'
                    )
                  }
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-resources">
            <h4>Resources</h4>

            <ul>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo('home')
                  }
                >
                  About Us
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'contact'
                    )
                  }
                >
                  Help Center
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo('home')
                  }
                >
                  Privacy Policy
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo('home')
                  }
                >
                  Terms & Conditions
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      'community'
                    )
                  }
                >
                  Community Guidelines
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>

            <ul>
              <li>
                <i className="fa-regular fa-envelope"></i>
                support@classmate.com
              </li>

              <li>
                <i className="fa-solid fa-phone"></i>
                +254 700 123 456
              </li>

              <li>
                <i className="fa-solid fa-location-dot"></i>
                Kenya • Africa
              </li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>
            © 2026 ClassMate.com. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <button
              type="button"
              onClick={() =>
                navigateTo('home')
              }
            >
              Privacy
            </button>

            <span>|</span>

            <button
              type="button"
              onClick={() =>
                navigateTo('home')
              }
            >
              Terms
            </button>

            <span>|</span>

            <button
              type="button"
              onClick={() =>
                navigateTo('home')
              }
            >
              Cookies
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;