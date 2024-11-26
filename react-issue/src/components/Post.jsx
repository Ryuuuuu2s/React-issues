import React, { useEffect, useState } from 'react';
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import './Post.css';
import { auth, db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';

const Post = () => {
  const [postList, setPostList] = useState([]);
  const [postText, setPostText] = useState("");

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

  // コメント作成
  const createComment = async (postId) => {
    if (postText.trim() !== "") {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        text: postText,
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
          photoURL: auth.currentUser.photoURL
        },
        createdAt: new Date().getTime()
      });
      setPostText("");
    }
    window.location.href = '/createpost';
  };


  // いいね機能
  const toggleLike = async (post) => {
    const postRef = doc(db, 'posts', post.id);
    const isLiked = post.likes.includes(auth.currentUser.uid);
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(auth.currentUser.uid),
        likesCount: Math.max(post.likesCount - 1, 0)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(auth.currentUser.uid),
        likesCount: post.likesCount + 1
      });
    }
    setPostList(postList.map(p => p.id === post.id ? {
      ...p,
      likesCount: isLiked ? Math.max(p.likesCount - 1, 0) : p.likesCount + 1,
      likes: isLiked ? p.likes.filter(uid => uid !== auth.currentUser.uid) : [...p.likes, auth.currentUser.uid]
    } : p));
  };


  // コメント開閉
  const comment = (event) => {
    const responseContainer = event.currentTarget.closest('.postItem').querySelector('.responseContainer');
    responseContainer.classList.toggle('active');
  }



  return (
    <>
      {postList.map((post) => (
        <div className='postItem' key={post.id}>
          
          <div className="postItemWhopper">
            <div className="postItemContent">
              <img className='img' src={post.author.photoURL || ""} alt="アイコン" />
              <div className="text">{post.postText}</div>
            </div>
            <div className="postName">@{post.author.username}</div>
            <div className="postReaction">
              <div className="postReactionWhopper">
                <FontAwesomeIcon
                  className="good"
                  icon={faHeart}
                  onClick={() => toggleLike(post)}
                  style={{ color: post.likes.includes(auth.currentUser.uid) ? 'red' : 'grey' }}
                />
                <p>{post.likesCount}</p>
              </div>
              <div className="postReactionWhopper">
                <FontAwesomeIcon onClick={(event) => comment(event)} className="response" icon={faCommentDots} />
                <p>{post.commentsCount}</p>
              </div>
            </div>
          </div>

          <div className="responseContainer">
            <div className="responseInput">
              <textarea
                placeholder='コメントする'
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              ></textarea>
              <button className='responseButton' onClick={() => createComment(post.id)}>
                POST
              </button>
            </div>
            <div className="responseContent">
              {post.comments && post.comments.map((comment) => (
                <div key={comment.id} className="responseItem">
                  <div className="responseItemWhopper">
                    <img className="responseIcon" src={comment.author.photoURL || ""} alt="アイコン" />
                    <div className="responseText">{comment.text}</div>
                  </div>
                  <div className="responseName">@{comment.author.username}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ))}
    </>
  );
};

export default Post;