import { useEffect, useState } from "react";
import styles from "./Product.module.css";
import axios from "axios";

interface ProductProps {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  brandId: number;
  imageUrl: string | null;
  price: number;
  discount: number;
}

interface CommentProps {
  productId: number;
  userId: number;
  starsNumber: number;
  comment: string;
  date: string;
}

interface ProductComponentProps {
  product: ProductProps;
}

export default function Product(props: ProductComponentProps) {
  const product: ProductProps = props.product;
  const [bigProductDisplay, setBigProductDisplay] = useState<boolean>(false);
  const [numberToBuy, setNumberToBuy] = useState<number>(1);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [averageRating, setAverageRating] = useState<number>(0);

  const productPriceAfterDiscount: string = (
    product.price *
    (1 - product.discount)
  ).toFixed(2);

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await axios.get(
        `http://localhost:8080/categories/${product.categoryId}`
      );

      if (response.status === 200) {
        setCategoryName(response.data.categoryName);
      } else {
        // no category fetched
        setCategoryName("No category");
      }
    };

    const fetchBrand = async () => {
      const response = await axios.get(
        `http://localhost:8080/brands/${product.brandId}`
      );

      if (response.status === 200) {
        setBrandName(response.data.brandName);
      } else {
        // no brand fetched
        setBrandName("No brand");
      }
    };

    fetchCategory();
    fetchBrand();
  }, []);

  const onBigDisplayShow = async () => {
    setBigProductDisplay(true);

    if (!commentsLoaded) {
      const fetchCommentsAndRating = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/comments/getcommentsforproduct/${product.id}`
          );

          const comments: CommentProps[] = response.data;
          setComments(comments);

          let ratingSum = 0;
          comments.forEach((comment) => {
            ratingSum += comment.starsNumber;
          });
          if (comments.length) setAverageRating(ratingSum / comments.length);
        } catch (err) {
          setCommentsError("Error retrieving comments");
          console.log(err);
        } finally {
          setCommentsLoaded(true);
        }
      };

      fetchCommentsAndRating();
    }
  };

  const handleAddToCart = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const localStorageCart = localStorage.getItem("cart");
    const cart: Array<{ product: ProductProps; qty: number }> = localStorageCart
      ? JSON.parse(localStorageCart)
      : [];

    let productFound = false;

    cart.forEach((element) => {
      if (element.product.id === product.id) {
        element.qty += numberToBuy;
        productFound = true;
        return;
      }
    });

    if (!productFound) {
      cart.push({ product: product, qty: numberToBuy });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <>
      {bigProductDisplay ? (
        <div className={styles.disableOutsideClicks}>
          <div className={styles.bigProductDiv}>
            <div className={styles.imageAndProductDiv}>
              <div className={styles.imageDiv}>
                <img
                  src={product.imageUrl || "src/assets/product-no-image.jpg"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "src/assets/product-no-image.jpg";
                    (e.target as HTMLImageElement).onerror = null;
                  }}
                  alt="no image"
                />
              </div>
              <div className={styles.productAndBuyDiv}>
                <div className={styles.titleDiv}>{product.title}</div>
                <div className={styles.starsDiv}>
                  STARS: {averageRating} ({comments.length} reviews)
                </div>
                <div className={styles.descriptionDiv}>
                  {product.description}
                </div>
                <div className={styles.priceDiv}>
                  <div className={styles.newPriceDiv}>
                    {productPriceAfterDiscount}zł
                  </div>
                  {product.discount ? (
                    <>
                      <div className={styles.oldPriceDiv}>
                        {product.price}zł
                      </div>
                      <div className={styles.discountDiv}>
                        -{product.discount * 100}%
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <div className={styles.addToCartDiv}>
                  <form onSubmit={handleAddToCart}>
                    <label htmlFor="productQuantityInput">Quantity: </label>
                    <input
                      id="productQuantityInput"
                      type="number"
                      min={1}
                      value={numberToBuy}
                      onChange={(e) => {
                        setNumberToBuy(parseInt(e.target.value));
                      }}
                      required
                    />
                    <br />
                    <button type="submit">Add to cart</button>
                  </form>
                </div>
                <div className={styles.brandCategoryIdDiv}>
                  <div>Category:{categoryName}</div>
                  <div>Brand:{brandName}</div>
                  <div>id: #{product.id}</div>
                </div>
              </div>
            </div>
            <div className={styles.commentsDiv}>
              Comments:
              {commentsError ? (
                <>commentsError</>
              ) : (
                <>
                  {comments.length ? (
                    <>
                      {comments &&
                        comments.map((comment) => {
                          return (
                            <div
                              className={styles.singleCommentDiv}
                              key={(comment.productId, comment.userId)}
                            >
                              stars:{comment.starsNumber} date:{comment.date}
                              <br />
                              user:{comment.userId}
                              <br />
                              {comment.comment}
                            </div>
                          );
                        })}
                    </>
                  ) : (
                    <>
                      <br />
                      Product has no comments
                    </>
                  )}
                </>
              )}
            </div>

            <button
              className={styles.closeButton}
              onClick={() => setBigProductDisplay(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.productDiv} onClick={onBigDisplayShow}>
          <div className={styles.imageDiv}>
            <img
              src={product.imageUrl || "src/assets/product-no-image.jpg"}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "src/assets/product-no-image.jpg";
                (e.target as HTMLImageElement).onerror = null;
              }}
              alt="no image"
            />
          </div>

          <div className={styles.titleDiv}>{product.title}</div>

          <div className={styles.productInfoDiv}>
            <div className={styles.categoryAndBrandDiv}>
              <div>{categoryName}</div>
              <div>{brandName}</div>
            </div>
            <div className={styles.priceDiv}>
              {product.discount ? (
                <div className={styles.oldPriceDiv}>{product.price}zł</div>
              ) : (
                <></>
              )}
              <div className={styles.currentPriceDiv}>
                {productPriceAfterDiscount}zł
              </div>
            </div>
          </div>

          <div className={styles.discountDiv}>
            {product.discount ? (
              <>
                <div>-{product.discount * 100}%</div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
}
