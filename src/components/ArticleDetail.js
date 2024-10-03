import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import '../style/ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [articleTexts, setArticleTexts] = useState([]);
    const [newText, setNewText] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const { isAdmin } = useContext(UserContext);

    // Charger l'article et les textes associés
    // Charger l'article et les textes associés
useEffect(() => {
    const fetchArticleAndTexts = async () => {
        try {
            const articleResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/articles/${id}`);
            setArticle(articleResponse.data);

            const textResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/articles/${id}/texts`);
            // Trier les textes par position avant de les mettre dans l'état
            const sortedTexts = textResponse.data.sort((a, b) => a.position - b.position);
            setArticleTexts(sortedTexts);
        } catch (err) {
            console.error('Erreur lors de la récupération des données', err);
        }
    };
    fetchArticleAndTexts();
}, [id]);


    useEffect(() => {
        if (!isAdmin) {
            setIsEditing(null);
        }
    }, [isAdmin]);

    const getImagePath = (imageUrl) => {
        return imageUrl ? `/images/${imageUrl}` : '/images/default-image.png';
    };

    const handleAddTextOrImage = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/articles/${id}/texts`, {
                text: newText,
                imageurl: newImageUrl
            });
            setArticleTexts([...articleTexts, response.data]);
            setNewText('');
            setNewImageUrl('');
        } catch (err) {
            console.error('Erreur lors de l\'ajout du texte ou de l\'image', err);
        }
    };

    const handleEditText = async (textId) => {
        const updatedText = articleTexts.find(text => text.id === textId);
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/articles_text/${textId}`, { text: updatedText.text });
            setIsEditing(null);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du texte ou de l\'image', err);
        }
    };

    const handleDeleteText = async (textId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/articles_text/${textId}`);
            setArticleTexts(articleTexts.filter(text => text.id !== textId));
        } catch (err) {
            console.error('Erreur lors de la suppression du texte ou de l\'image', err);
        }
    };

    const handleInputChange = (e, textId) => {
        const updatedTexts = articleTexts.map((text) => {
            if (text.id === textId) {
                return { ...text, text: e.target.value };
            }
            return text;
        });
        setArticleTexts(updatedTexts);
    };

    // Fonction pour déplacer un texte vers le haut
    const moveTextUp = async (index) => {
        if (index > 0) {
            const updatedTexts = [...articleTexts];
            
            const currentText = updatedTexts[index];
            const previousText = updatedTexts[index - 1];

            updatedTexts[index] = previousText;
            updatedTexts[index - 1] = currentText;

            setArticleTexts(updatedTexts);
            
            await updateTextPosition(currentText.id, currentText.position - 1);
            await updateTextPosition(previousText.id, previousText.position + 1);
        }
    };

    // Fonction pour déplacer un texte vers le bas
    const moveTextDown = async (index) => {
        if (index < articleTexts.length - 1) {
            const updatedTexts = [...articleTexts];

            const currentText = updatedTexts[index];
            const nextText = updatedTexts[index + 1];

            updatedTexts[index] = nextText;
            updatedTexts[index + 1] = currentText;

            setArticleTexts(updatedTexts);
            
            await updateTextPosition(currentText.id, currentText.position + 1);
            await updateTextPosition(nextText.id, nextText.position - 1);
        }
    };


    const updateTextPosition = async (textId, newPosition) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/articles_text/${textId}/position`, {
                position: newPosition
            });
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la position', err);
        }
    };

    if (!article) return <div>Chargement...</div>;

    return (
        <>
            <div className="full-page-background"></div>
            <div className="article-detail-container">
                <div className="article-content">
                    <h1>{article.title}</h1>
                    <h3>{article.content}</h3>
                    <img src={getImagePath(article.imageurl)} alt={article.title} />

                    <ul>
                        {articleTexts.map((text, index) => (
                            <li key={text.id}>
                                {isEditing === text.id ? (
                                    <>
                                        <textarea
                                            value={text.text}
                                            onChange={(e) => handleInputChange(e, text.id)}
                                        />
                                        <button onClick={() => handleEditText(text.id)}>Enregistrer</button>
                                        <button onClick={() => setIsEditing(null)}>Annuler</button>
                                    </>
                                ) : (
                                    <>
                                        {text.text ? <p>{text.text}</p> : <img src={getImagePath(text.imageurl)} alt="Texte associé" />}
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => setIsEditing(text.id)}>Modifier</button>
                                                <button onClick={() => handleDeleteText(text.id)}>Supprimer</button>
                                                <button onClick={() => moveTextUp(index)}>Monter</button>
                                                <button onClick={() => moveTextDown(index)}>Descendre</button>
                                            </>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                    {isAdmin && (
                        <div>
                            <h4>Ajouter un nouveau texte ou une image</h4>
                            <textarea
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                placeholder="Ajouter un nouveau texte"
                            />
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="URL de l'image"
                            />
                            <button onClick={handleAddTextOrImage}>Ajouter</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ArticleDetail;
