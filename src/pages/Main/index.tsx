import styles from "./styles.module.scss";
import main_background from "@/assets/main_background.png";
import upload from "@/assets/upload.svg";
import searchIcon from "@/assets/search.svg";
import { useCallback, useEffect, useState } from "react";
import {
  useDropzone,
  DropzoneRootProps,
  DropzoneInputProps,
} from "react-dropzone";
import LogoTitle from "@/components/LogoTitle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { restFetcher } from "@/queryClient";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useSearchFlower from "@/hooks/useSearchFlower";

import NavigationBar from "@/components/NavigationBar";
import { ResultData } from "@/types/result";

interface FileType extends File {
  preview: string;
}

export default function MainPage() {
  const [taskId, setTaskId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useMutation((formData: FormData) =>
    restFetcher({ method: "POST", path: "/flowers/image/", body: formData }),
  );
  const { refetch } = useQuery(
    ["AIResult"],
    () =>
      restFetcher({
        method: "GET",
        path: "/flowers/image/",
        params: { task_id: taskId },
      }),
    {
      enabled: false,
      onSuccess: (data: ResultData[] | ["WAITING"]) => {
        if (data[0] === "WAITING") setTimeout(refetch, 2000);
        else {
          setIsLoading(false);
          navigate("/result", {
            state: {
              data,
            },
          });
        }
      },
    },
  );
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileType[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("id", files[0]);
    setIsLoading(true);
    mutate(formData, {
      onSuccess: (data) => {
        setTaskId(data.task_id);
      },
    });
  };
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });
  const isFileUploaded = Boolean(files.length);
  useEffect(() => {
    if (taskId !== "") refetch();
  }, [taskId]);
  return (
    <div className={styles.container}>
      <NavigationBar />

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <h1>판별중입니다...</h1>
          <Loading />
        </div>
      ) : (
        <Content
          isDragAccept={isDragAccept}
          isFileUploaded={isFileUploaded}
          files={files}
          handleUpload={handleUpload}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      )}
      <div
        className={styles.backgroundImg}
        style={{ backgroundImage: `url(${main_background})` }}
      />
    </div>
  );
}

type ContentProps = {
  isDragAccept: boolean;
  isFileUploaded: boolean;
  files: FileType[];
  handleUpload: () => void;
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
};

function Content({
  isDragAccept,
  isFileUploaded,
  files,
  handleUpload,
  getRootProps,
  getInputProps,
}: ContentProps) {
  const [flowerName, handleFlowerName, goToEncy, onKeyDown] =
    useSearchFlower("");
  return (
    <div className={styles.content}>
      <LogoTitle />

      <motion.div
        className={`flex flex-row ${styles.searchContainer}`}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.3, duration: 0.8 },
        }}
      >
        <input
          className={`flex border-blue-600  ${styles.searchInput}`}
          placeholder="Type in the Flower Name"
          onChange={handleFlowerName}
          onKeyDown={onKeyDown}
          value={flowerName}
        />
        <button
          type="submit"
          className={`${styles.searchbtn} bg-white`}
          onClick={goToEncy}
        >
          <img className={styles.searchIcon} src={searchIcon} />
        </button>
      </motion.div>
      <motion.div
        className={styles.dropContainer}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.3, duration: 0.8 },
        }}
      >
        <div
          className={`${styles.dropzone} ${isDragAccept && styles.dropping}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isFileUploaded ? (
            <img className={styles.preview} src={files[0].preview} />
          ) : (
            <img src={upload} />
          )}
        </div>
        {isFileUploaded ? (
          <button className={styles.uploadbtn} onClick={handleUpload}>
            업로드
          </button>
        ) : (
          <p>파일 선택 또는 드래그</p>
        )}
      </motion.div>
    </div>
  );
}
