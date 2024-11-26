import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { updateProfile, signOut, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs, getDoc, setDoc } from 'firebase/firestore';

import './Setting.css';

const Setting = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(auth.currentUser ? auth.currentUser.displayName : '');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // プロフィール情報を更新する処理
  // const updateProfileInfo = async () => {
  //   const userRef = doc(db, 'users', auth.currentUser.uid);
  //   const docSnap = await getDoc(userRef);

  //   if (image) {
  //     const imageRef = ref(storage, `profile/${auth.currentUser.uid}`);
  //     await uploadBytes(imageRef, image);
  //     const url = await getDownloadURL(imageRef);
  //     await updateProfile(auth.currentUser, { photoURL: url });
  //     if (docSnap.exists()) {
  //       await updateDoc(userRef, { photoURL: url });
  //     } else {
  //       await setDoc(userRef, { photoURL: url });
  //     }
  //   }

  //   if (name && name !== auth.currentUser.displayName) {
  //     await updateProfile(auth.currentUser, { displayName: name });
  //     if (docSnap.exists()) {
  //       await updateDoc(userRef, { name: name });
  //     } else {
  //       await setDoc(userRef, { name: name });
  //     }

  //     // すべての投稿とコメントのユーザー名を更新
  //     const postsRef = collection(db, 'posts');
  //     const q = query(postsRef, where("author.id", "==", auth.currentUser.uid));
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach(async (postDoc) => {
  //       await updateDoc(postDoc.ref, { "author.username": name });

  //       const commentsRef = collection(db, 'posts', postDoc.id, 'comments');
  //       const commentsQuery = query(commentsRef, where("author.id", "==", auth.currentUser.uid));
  //       const commentsSnapshot = await getDocs(commentsQuery);
  //       commentsSnapshot.forEach(async (commentDoc) => {
  //         await updateDoc(commentDoc.ref, { "author.username": name });
  //       });
  //     });
  //   }

  //   navigate("/");
  // };

    // プロフィール情報を更新する処理（改）
    const updateProfileInfo = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
  
      let newPhotoURL = auth.currentUser.photoURL;
  
      if (image) {
        const imageRef = ref(storage, `profile/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, image);
        newPhotoURL = await getDownloadURL(imageRef);
        await updateProfile(auth.currentUser, { photoURL: newPhotoURL });
        if (docSnap.exists()) {
          await updateDoc(userRef, { photoURL: newPhotoURL });
        } else {
          await setDoc(userRef, { photoURL: newPhotoURL });
        }
      }
  
      if (name && name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
        if (docSnap.exists()) {
          await updateDoc(userRef, { name: name });
        } else {
          await setDoc(userRef, { name: name });
        }
  
        // すべての投稿とコメントのユーザー名と画像URLを更新
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where("author.id", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (postDoc) => {
          await updateDoc(postDoc.ref, { 
            "author.username": name,
            "author.photoURL": newPhotoURL
          });
  
          const commentsRef = collection(db, 'posts', postDoc.id, 'comments');
          const commentsQuery = query(commentsRef, where("author.id", "==", auth.currentUser.uid));
          const commentsSnapshot = await getDocs(commentsQuery);
          commentsSnapshot.forEach(async (commentDoc) => {
            await updateDoc(commentDoc.ref, { 
              "author.username": name,
              "author.photoURL": newPhotoURL
            });
          });
        });
      } else if (image) {
        // 画像のみ変更された場合も投稿とコメントの画像URLを更新
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where("author.id", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (postDoc) => {
          await updateDoc(postDoc.ref, { 
            "author.photoURL": newPhotoURL
          });
  
          const commentsRef = collection(db, 'posts', postDoc.id, 'comments');
          const commentsQuery = query(commentsRef, where("author.id", "==", auth.currentUser.uid));
          const commentsSnapshot = await getDocs(commentsQuery);
          commentsSnapshot.forEach(async (commentDoc) => {
            await updateDoc(commentDoc.ref, { 
              "author.photoURL": newPhotoURL
            });
          });
        });
      }
  
      navigate("/");
    };

  // アカウントを削除する処理
  const handleDeleteAccount = async () => {
    // ユーザーに確認を求める
    if (window.confirm("本当にアカウントを削除しますか？すべの収支、投稿が削除されます。")) {
      // 投稿とコメントの削除
      const postsRef = collection(db, 'posts');
      const postsQuery = query(postsRef, where("author.id", "==", auth.currentUser.uid));
      const postsSnapshot = await getDocs(postsQuery);
      for (const postDoc of postsSnapshot.docs) {
        const commentsRef = collection(db, 'posts', postDoc.id, 'comments');
        const commentsSnapshot = await getDocs(commentsRef);
        for (const commentDoc of commentsSnapshot.docs) {
          await deleteDoc(commentDoc.ref);
        }
        await deleteDoc(postDoc.ref);
      }

      // 収支データの削除
      const transactionsRef = collection(db, 'Transactions');
      const transactionsQuery = query(transactionsRef, where("author.id", "==", auth.currentUser.uid));
      const transactionsSnapshot = await getDocs(transactionsQuery);
      for (const transactionDoc of transactionsSnapshot.docs) {
        await deleteDoc(transactionDoc.ref);
      }

      try {
        await deleteUser(auth.currentUser);
        signOut(auth).then(() => {
          localStorage.clear();
          setIsAuth(false);
          navigate('/login');
        });
      } catch (error) {
        console.error("Error removing user: ", error);
        if (error.code === 'auth/requires-recent-login') {
          alert('Please log in again to delete your account.');
        }
      }
    } else {
      // ユーザーが削除をキャンセルした場合
      alert("アカウント削除がキャンセルされました。");
    }
  };

  return (
    <div className="SettingContainer">
      <div className='settingArea'>
        <h2>UserSetting</h2>
        <div className="settingAreaContent">
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="新しいユーザー名" />
          <button onClick={updateProfileInfo}>Update Profile</button>
          <button onClick={handleDeleteAccount} className='deleteAccountButton'>Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Setting;