import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import styles from "./AddComment.module.css";
import axios from "axios";

interface AddCommentProps {
  productId: number;
}

export default function AddComment({ productId }: AddCommentProps) {
  const { userId } = useAuthContext();

  const [comment, setComment] = useState<string>("");
  const [starsNumber, setStarsNumber] = useState<number>(5);

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem("jwtToken");

    try {
      const response = await axios.post("http://localhost:8080/comments", {
        jwtToken,
        productId,
        starsNumber,
        comment: comment,
      });

      setComment("");
    } catch (err) {
      console.error("Error adding comment: ", err);
    }
  };

  return (
    <>
      {userId ? (
        <div className={styles.addCommentDiv}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="commentTextArea">Add comment</label>
            <br />
            <label htmlFor="starsSelect">Stars</label>
            <select
              id="starsSelect"
              onChange={(e) => setStarsNumber(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
            <br />
            <textarea
              id="commentTextArea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <br />
            <button type="submit">Add comment</button>
          </form>
        </div>
      ) : (
        <div className={styles.commentLoginMessage}>
          You need to login to add comment
        </div>
      )}
    </>
  );
}
