import Image from "next/image"
import styles from "../styles/Home.module.css";

function VariantCard({ key, className, variant, onClick }) {
  return (
    <div id={key} className={className} onClick={onClick}>
      <Image className={styles.cardImage} src="https://picsum.photos/200" width="200" height="200" alt="random image"/>
      <div className={styles.cardInfo}>
        <p>{`${variant}`}</p>
          <p className="cardBody">Some info here</p>
      </div>
    </div>
  )
}

export default VariantCard