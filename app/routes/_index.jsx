import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import sweater from '../assets/sweater.png';
import sweater2 from '../assets/sweater2.png';
import React, {useState} from 'react';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const [selectedColor, setSelectedColor] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    if (password.trim().toLowerCase() === 'friends&family') {
      setAuthenticated(true);
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute('content', 'width=device-width, initial-scale=1.0');
    } else {
      alert('Incorrect password. Please try again.');
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
          />
          <button onClick={handleLogin}>Submit</button>
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
            <p>$85.00 USD</p>
          </div>
          <div className="product-details">
            <p>
              Staff is the working class of our favorite places, brands,
              restaurants, and events. First we are proud to highlight Lucesca -
              celebrating the beauty of returning home.
            </p>
            <p>
              Heavyweight (13 oz.) Hoodie • Everywhere’s 100% GRS-Certified
              Recycled Cotton
            </p>
          </div>
          <Form
            selectedColor={selectedColor}
            handleCircleClick={handleCircleClick}
          />
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

function Form({selectedColor, handleCircleClick}) {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const handleSizeClick = (size) => {
    setSelectedSize(size === selectedSize ? '' : size);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
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
    };
    console.log(formData); // For testing: Log form data

    // Process form data here (e.g., send it to backend)
    // Reset form fields after submission if needed
    // setFullName('');
    // setAddress('');
    // setApartment('');
    // setCity('');
    // setState('');
    // setZipCode('');
    // setEmail('');
    // setPhoneNumber('');
    // setSelectedSize('');
    // setSelectedColor(null)
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="toggle-container">
          <div
            className={`circle ${
              selectedColor === 'black' ? 'selected-black' : 'black'
            }`}
            onClick={() => handleCircleClick('black')}
          ></div>
          <div
            className={`circle ${
              selectedColor === 'white' ? 'selected-white' : 'white'
            }`}
            onClick={() => handleCircleClick('white')}
          ></div>
        </div>
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
            required
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

        <button type="submit">Reserve</button>
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
