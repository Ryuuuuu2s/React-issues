import React, { useEffect, useState } from 'react';
import './CreatePost.css';
import { collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Post from '../components/Post';
import { useNavigate } from 'react-router-dom';
import SearchResult from '../components/SearchResult';

const CreatePost = ({ isAuth }) => {
  const [postText, setPostText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // 投稿を作成する処理
  const createPost = async () => {
    await addDoc(collection(db, 'posts'), {
      postText: postText,
      author: {
        username: auth.currentUser.displayName,
        id: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL
      },
      createdAt: new Date().getTime()
    });
    window.location.href = '/createpost';
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const fetchPosts = async () => {
    let postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    if (searchQuery) {
      postsQuery = query(collection(db, 'posts'), where('postText', '>=', searchQuery), where('postText', '<=', searchQuery + '\uf8ff'));
    }
    const querySnapshot = await getDocs(postsQuery);
    const postsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setPosts(postsData);
  };

  const handleSearch = () => {
    fetchPosts();
    console.log(fetchPosts());
  };


  return (
    <div className='createPostPageContainer'>

      <div className="searchArea">
        <input
          type="text"
          placeholder='Search...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={!searchQuery}
        >
          SEARCH
        </button>
      </div>

      <div className="createPostPage">
        <div className="postContainer">
          <h1>ChatArea</h1>
          <div className="inputPost">
            <textarea
              placeholder='何してるの？'
              onChange={(e) => setPostText(e.target.value)}
            ></textarea>
          </div>
          <button
            className='postButton'
            onClick={createPost}
            disabled={!postText}
          >
            POST
          </button>
        </div>
      </div>

      {/* 投稿一覧 */}
      <div className="postArea">
        {posts.length > 0 ? (
          <SearchResult posts={posts} />
        ) : (
          <Post />
        )}
      </div>

    </div>
  )
}

export default CreatePost
