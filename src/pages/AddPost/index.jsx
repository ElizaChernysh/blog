import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import instance from "../../axios";
import { createPost} from "../../redux/slices/posts";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const inputFiledRef = useRef(null);

  const dispatch = useDispatch();

  const isEditing = Boolean(id);

  // const handleChangeFile = async (event) => {
  //   try {
  //     const file = event.target.files[0];
  //     console.log(file);
  //     console.log(file.name);
  //     console.log("try again");
  //     const formData = new FormData();
  //     formData.append("myImage", file.name);

  //     // const { data } = await instance.post(`/upload`, formData);
  //   } catch (err) {
  //     console.warn(err);
  //     alert("Помилка при завантаженні файла");
  //   }
  // };

  console.log(imageUrl);

  const onClickRemoveImage = () => {
    setImageUrl(null);
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await instance.patch(`/posts/${id}`, fields)
        : await instance.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert("Помилка при завантаженні cтатті");
    }
  };

  // const onSubmit = async () => {
  //   try {
  //     const data = new FormData();
  //     data.append("title", title);
  //     data.append("text", text);
  //     data.append("image", imageUrl);
  //     data.append("tags", tags)

  //     dispatch(createPost(data));
  //     navigate("/");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    if (id) {
      instance.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(","));
      });
    }
  }, [id]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <form action="/upload" enctype="multipart/form-data" method="POST">
        <Button
          onClick={(event) => inputFiledRef.current.click()}
          variant="outlined"
          size="large"
        >
          Завантажити прев'ю
        </Button>
        <input
          name="image"
          ref={inputFiledRef}
          type="file"
          onChange={(e) => e.target.files[0]}
          // onChange={handleChangeFile}
          hidden
        />
      </form>
      <div>
        {imageUrl && (
          <img src={URL.createObjectURL(imageUrl)} alt={imageUrl.name} />
        )}
      </div>
      {/* <div>{imageUrl && `${imageUrl.name} - ${imageUrl.type}`}</div> */}
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Видалити
          </Button>
          <img
            className={styles.image}
            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Зберегти" : "Опублікувати"}
        </Button>
        <a href="/">
          <Button size="large">Відмінити</Button>
        </a>
      </div>
    </Paper>
  );
};
