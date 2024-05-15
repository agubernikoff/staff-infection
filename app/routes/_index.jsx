import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import sweater from '../assets/sweater.png';
import sweater2 from '../assets/sweater2.png';
import socialSharingImage from '../assets/socialSharingImage.jpg';
import React, {useState, useEffect, Suspense} from 'react';
import emailjs from '@emailjs/browser';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {
      title: 'STAFF',
      description:
        'Staff celebrates the people working at our favorite places, brands, restaurants, and events as well as challenges the idea of what it means to go to work.',
      'og:description':
        'Staff celebrates the people working at our favorite places, brands, restaurants, and events as well as challenges the idea of what it means to go to work.',
      'og:image': socialSharingImage,
    },
  ];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const publicKey = context.env.EMAIL_JS_PUBLIC_KEY;
  const privateKey = context.env.EMAIL_JS_PRIVATE_KEY;
  return defer({
    featuredCollection,
    recommendedProducts,
    publicKey,
    privateKey,
  });
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const [selectedColor, setSelectedColor] = useState('white');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      document.body.style.overflow = 'hidden';
      const viewport = document.querySelector('meta[name=viewport]');
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
      );
    } else {
      document.body.style.overflow = 'auto';
      const viewport = document.querySelector('meta[name=viewport]');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }

    return () => {
      document.body.style.overflow = 'auto';
      const viewport = document.querySelector('meta[name=viewport]');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    };
  }, [authenticated]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    // event.preventDefault();
    if (password.trim() === 'Friends&Family') {
      setAuthenticated(true);
      window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin(); // Call handleLogin function when Enter key is pressed
    }
  };

  // Function to handle circle click
  const handleCircleClick = (color) => {
    setSelectedColor(color === selectedColor ? selectedColor : color);
  };

  return (
    <>
      {!authenticated ? (
        <div className="login-container">
          <p>Enter Password:</p>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleLogin}>Submit</button>
        </div>
      ) : submitted ? (
        <div className="login-container">
          <div className="product-details">
            <p>
              Thank you for your participation in STAFF’s pre-launch.
              <br />
              You’re order is pending.
            </p>
            <p>
              Upon confirmation, we will send you a request on venmo to complete
              your purchase. <br />
              Thank you.
            </p>
            <button onClick={() => setSubmitted(false)}>Back to Home</button>
          </div>
        </div>
      ) : (
        <div className="home">
          {/* <FeaturedCollection collection={data.featuredCollection} /> */}
          {/* <RecommendedProducts products={data.recommendedProducts} /> */}

          <div className="prod-img">
            <img src={selectedColor == 'black' ? sweater : sweater2} />
          </div>
          <div className="price-title">
            <p>STAFF x Lucesca Hoodie</p>
            {/* <p>$85.00 USD</p> */}
          </div>
          <div className="product-details">
            <p>
              Staff celebrates the people working at our favorite places,
              brands, restaurants, and events as well as challenges the idea of
              what it means to go to work.
            </p>
            <p style={{marginBottom: '0%'}}>
              • Lightweight (8 oz.) and Heavyweight (13 oz.) Hoodie Options
              Available
            </p>
            <p>• Everywhere’s 100% GRS-Certified Recycled Cotton</p>
          </div>
          <Form
            selectedColor={selectedColor}
            handleCircleClick={handleCircleClick}
            publicKey={data.publicKey}
            privateKey={data.privateKey}
            setSubmitted={setSubmitted}
          />
          <p className="footer-text">
            &copy; 2024 Staff Collective, Rights Reserved.
          </p>
        </div>
      )}
    </>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */

function Form({
  selectedColor,
  handleCircleClick,
  publicKey,
  privateKey,
  setSubmitted,
}) {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');

  const handleSizeClick = (size) => {
    setSelectedSize(size === selectedSize ? '' : size);
  };

  const handleWeightClick = (weight) => {
    setSelectedWeight(weight === selectedWeight ? '' : weight);
  };

  emailjs.init({
    publicKey: publicKey,
    privateKey: privateKey, // optional, highly recommended for security reasons
  });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const btn = document.querySelector('.reserve-btn');
    console.log(btn, btn.nextSibling, btn.nextSibling);
    btn.nextSibling.classList.add('progress-bar');
    // Prepare form data
    const formData = {
      fullName,
      address,
      apartment,
      city,
      state,
      zipCode,
      email,
      phoneNumber,
      selectedSize,
      selectedColor,
      selectedWeight,
    };
    console.log(formData); // For testing: Log form data

    // Process form data here (e.g., send it to backend)
    emailjs
      .send('service_07ghhgi', 'template_ibx153g', {
        fullName: fullName,
        address: address,
        apt: apartment,
        city: city,
        state: state,
        zipCode: zipCode,
        email: email,
        phoneNumber: phoneNumber,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        selectedWeight: selectedWeight,
      })
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          btn.nextSibling.nextSibling.classList.add('complete');
          setTimeout(() => {
            setSubmitted(true);
            // Reset form fields after submission if needed
            setFullName('');
            setAddress('');
            setApartment('');
            setCity('');
            setState('');
            setZipCode('');
            setEmail('');
            setPhoneNumber('');
            setSelectedSize('');
            setSelectedWeight('');
            handleCircleClick(null);
          }, 250);
        },
        (err) => {
          console.log('FAILED...', err);
        },
      );
  };

  return (
    <div className="form-container">
      <p>Color:</p>
      <form onSubmit={handleSubmit}>
        <div className="toggle-container">
          <div
            className={`circle ${
              selectedColor === 'white' ? 'selected-white' : 'white'
            }`}
            onClick={() => handleCircleClick('white')}
          ></div>
          <div
            className={`circle ${
              selectedColor === 'black' ? 'selected-black' : 'black'
            }`}
            onClick={() => handleCircleClick('black')}
          ></div>
        </div>
        <p
          style={{
            fontFamily: 'staff-font',
            fontSize: '.75rem',
            marginBottom: '.5rem',
          }}
        >
          Weight:
        </p>
        <div className="form-row weight-selector">
          {/* Weight Buttons */}
          {['Leightweight 8oz ($80.00)', 'Heavyweight 13oz ($85.00)'].map(
            (weight) => (
              <button
                key={weight}
                className={`weight-button ${
                  selectedWeight === weight ? 'selected' : ''
                }`}
                onClick={() => handleWeightClick(weight)}
                type="button" // Prevent button from submitting the form
              >
                {weight}
              </button>
            ),
          )}
        </div>
        <p
          style={{
            fontFamily: 'staff-font',
            fontSize: '.75rem',
            marginBottom: '.5rem',
          }}
        >
          Size:
        </p>
        <div className="form-row size-selector">
          {/* Size Buttons */}
          {['M', 'L', 'XL'].map((size) => (
            <button
              key={size}
              className={`size-button ${
                selectedSize === size ? 'selected' : ''
              }`}
              onClick={() => handleSizeClick(size)}
              type="button" // Prevent button from submitting the form
            >
              {size}
            </button>
          ))}
        </div>
        <div className="form-row">
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            id="apartment"
            name="apartment"
            placeholder="Apartment"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
          />
        </div>
        <div className="state-zip-city">
          <div className="form-row">
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              id="state"
              name="state"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div style={{position: 'relative'}}>
          <button className="reserve-btn" type="submit">
            Reserve
          </button>
          <div
            style={{
              position: 'absolute',
              background: 'black',
              zIndex: -2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              background: 'white',
              zIndex: -1,
              top: '-1px',
              bottom: '-1px',
              left: '95%',
              right: '-1px',
            }}
          />
        </div>
      </form>
    </div>
  );
}

function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
