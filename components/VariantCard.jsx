import Image from "next/image"
import styles from "../styles/Home.module.css";

function VariantCard({ key, className, variantTitle, variantDescription, onClick }) {
  return (
    <div id={key} className={className} onClick={onClick}>
      <Image className={styles.cardImage} src="https://picsum.photos/200" width="200" height="200" alt="random image"/>
      <div className={styles.cardInfo}>
        <p className={styles.cardVariantTitle}>{`${variantTitle}`}</p>
          <p className={styles.cardVariantDescription}>{`${variantDescription}`}</p>
      </div>
    </div>
  )
}

export default VariantCard