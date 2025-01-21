import { useState } from "react";
import styles from "./Product.module.css";
import axios from "axios";

interface ProductProps {
  id: number;
  title: string;
  description: string;
  categoryId: number;
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
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  const onBigDisplayShow = () => {
    setBigProductDisplay(true);

    if (commentsLoading) {
      const fetchComments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/comments/getcommentsforproduct/${product.id}`
          );
          setComments(response.data);
        } catch (err) {
          setCommentsError("Error retrieving comments");
          console.log(err);
        } finally {
          setCommentsLoading(false);
        }
      };

      fetchComments();
    }
  };

  const handleBuyProduct = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
  };

  return (
    <>
      {bigProductDisplay ? (
        <div className={styles.disableOutsideClicks}>
          <div className={styles.bigProductDiv}>
            <img
              src={product.imageUrl || "src/assets/product-no-image.jpg"}
              alt="no image"
            />
            <div>{product.title}</div>

            <div>{product.description}</div>
            <div>Category:{product.categoryId}</div>
            <div>stara cena:{product.price}</div>
            <div>nowa cena:{product.price * (1 - product.discount)}</div>
            <div>-{product.discount * 100}%</div>
            <div>id: #{product.id}</div>
            <form onSubmit={handleBuyProduct}>
              <label htmlFor="productQuantityInput">Podaj ilość produktu</label>
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
              <button type="submit">Kup produkt</button>
            </form>

            <div className={styles.commentsDiv}>
              Comments:
              {comments.length ? (
                <>
                  {comments &&
                    comments.map((comment) => {
                      return (
                        <div className={styles.singleCommentDiv}>
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
          <img
            src={product.imageUrl || "src/assets/product-no-image.jpg"}
            alt="no image"
          />

          <div className={styles.priceDiv}>
            <div className={styles.currentPriceDiv}>
              {product.price * (1 - product.discount)}zł
            </div>
            <div>
              {product.discount ? (
                <>
                  <div className={styles.oldPriceDiv}>{product.price}zł</div>
                  <div>-{product.discount * 100}%</div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className={styles.titleDiv}>{product.title}</div>
        </div>
      )}
    </>
  );
}
