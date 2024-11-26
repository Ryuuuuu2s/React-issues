import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import './Post.css';
import { db } from '../firebase';

const SearchResult = ({ posts }) => {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    // データベースから投稿を取得
    const fetchPosts = async () => {
      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const data = await getDocs(postsQuery);
      const posts = data.docs.map((doc) => {
        const postData = { ...doc.data(), id: doc.id, likesCount: doc.data().likesCount || 0, likes: doc.data().likes || [] };
        return postData;
      });

      // コメントを取得
      const postsWithCommentsCount = await Promise.all(posts.map(async (post) => {
        const commentsQuery = query(collection(db, 'posts', post.id, 'comments'), orderBy('createdAt', 'desc'));
        const commentsSnapshot = await getDocs(commentsQuery);
        post.comments = commentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        post.commentsCount = commentsSnapshot.docs.length;
        return post;
      }));

      setPostList(postsWithCommentsCount);
    };
    fetchPosts();
  }, []);



  return (
    <>
    <div className="SearchResult">
      <h2>検索結果</h2>

      {posts.map((post) => (
        <div className='postItem' key={post.id}>
          
          <div className="postItemWhopper">
            <div className="postItemContent">
              <img className='img' src={post.author.photoURL || ""} alt="アイコン" />
              <div className="text">{post.postText}</div>
            </div>
            <div className="postName">@{post.author.username}</div>
          </div>

        </div>
      ))}
    </div>
    </>
  );
};

export default SearchResult;