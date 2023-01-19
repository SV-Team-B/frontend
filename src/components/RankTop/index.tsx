import styles from "./styles.module.scss";
import logo from "@/assets/logo.svg";
import { Rank } from "@/types/rank";

type RankData = {
  index: number;
  result?: Rank;
  clicked: Boolean;
};

export default function RankTop({ index, result, clicked }: RankData) {
  return (
    <div className={`flex flex-col ${styles.container}`}>
      {result?.poison && <img className={styles.poison} src={logo} />}
      <h1 className={styles.rank}>
        {index === 0 ? index + 2 : index === 1 ? index : index + 1}위
      </h1>
      <img className={`${styles.image}`} src={result?.s3_url} />
      <hr className={styles.line} />
      <div className={`flex flex-row ${styles.labelContainer}`}>
        <div>{result?.name}</div>
        <div>{clicked ? result?.total_count : result?.count}회</div>
      </div>
    </div>
  );
}
