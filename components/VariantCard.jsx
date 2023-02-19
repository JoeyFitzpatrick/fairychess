import Image from "next/image"
import styles from "../styles/Home.module.css";
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

function VariantCard({ key, className, variant, onClick }) {
  return (
    <div key={key} className={className} onClick={onClick}>
      <Image className={styles.cardImage} src="https://picsum.photos/200" width="200" height="200" alt="random image"/>
      <div className={styles.cardInfo}>
        <p className="inter.className">{`${variant}`}</p>
          <p className="cardBody">Some info here</p>
      </div>
    </div>
  )
}

export default VariantCard