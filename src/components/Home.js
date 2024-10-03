import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../style/Home.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [originalArticle, setOriginalArticle] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newArticle, setNewArticle] = useState({ title: '', content: '', imageUrl: '' });
    const { isAdmin } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/articles`);
                
                const sortedArticles = response.data.sort((a, b) => a.id === 1 ? -1 : 1);
                
                setArticles(sortedArticles);
            } catch (err) {
                console.error('Erreur lors de la récupération des articles', err);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        if (!isAdmin) {
            setIsEditing(null);
            setIsAdding(false);
        }
    }, [isAdmin]);

    const handleArticleClick = (articleId) => {
        if (!isEditing) {
            navigate(`/articles/${articleId}`);
        }
    };

    const handleEditClick = (articleId, event) => {
        event.stopPropagation();
        setIsEditing(articleId);
        const articleToEdit = articles.find(article => article.id === articleId);
        setOriginalArticle({ ...articleToEdit });
    };

    const handleSaveClick = async (articleId) => {
        const articleToEdit = articles.find(article => article.id === articleId);
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/articles/${articleId}`, {
                title: articleToEdit.title,
                content: articleToEdit.content,
                imageUrl: articleToEdit.imageUrl
            });
            setIsEditing(null);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de l\'article', err);
        }
    };

    const handleCancelClick = () => {
        if (originalArticle) { 
            const updatedArticles = articles.map(article => {
                if (article.id === originalArticle.id) {
                    return { ...originalArticle }; 
                }
                return article;
            });
            setArticles(updatedArticles);
        }
        setIsAdding(false); 
        setIsEditing(null);
    };
    
    const handleInputChange = (e, articleId, field) => {
        if (articleId) {
            const updatedArticles = articles.map(article => {
                if (article.id === articleId) {
                    return { ...article, [field]: e.target.value };
                }
                return article;
            });
            setArticles(updatedArticles);
        } else {
            setNewArticle({ ...newArticle, [field]: e.target.value });
        }
    };

    const handleDeleteClick = async (articleId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/articles/${articleId}`);
            setArticles(articles.filter(article => article.id !== articleId));
        } catch (err) {
            console.error('Erreur lors de la suppression de l\'article', err);
        }
    };

    const handleAddArticleClick = () => {
        setIsAdding(true);
        setIsEditing(null);
        setNewArticle({ title: 'Nouveau Titre', content: 'Nouveau Contenu', imageUrl: 'default-image.png' });
    };

    const handleSaveNewArticleClick = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/articles`, newArticle);
            setArticles([...articles, response.data]);
            setIsAdding(false);
        } catch (err) {
            console.error('Erreur lors de l\'ajout de l\'article', err);
        }
    };

    const getImagePath = (imageUrl) => {
        if (imageUrl) {
            return `/images/${imageUrl}`;
        } else {
            return '/images/default-image.png';
        }
    };
    

    const updateArticlePosition = async (articleId, newPosition) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/articles/${articleId}/position`, { position: newPosition });
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la position de l\'article', err);
        }
    };
    
    const moveArticleUp = (index) => {
        if (index > 0) {
            const updatedArticles = [...articles];
            [updatedArticles[index - 1], updatedArticles[index]] = [updatedArticles[index], updatedArticles[index - 1]];
            
            setArticles(updatedArticles);
            
            updateArticlePosition(updatedArticles[index].id, index);
            updateArticlePosition(updatedArticles[index - 1].id, index - 1);
        }
    };
    
    const moveArticleDown = (index) => {
        if (index < articles.length - 1) {
            const updatedArticles = [...articles];
            [updatedArticles[index], updatedArticles[index + 1]] = [updatedArticles[index + 1], updatedArticles[index]];
            
            setArticles(updatedArticles);
            
            updateArticlePosition(updatedArticles[index].id, index);
            updateArticlePosition(updatedArticles[index + 1].id, index + 1);
        }
    };
    

    return (
        <>
            <div className="full-page-background"></div>
            <div className="home-container">
                {isAdmin && (
                    <div className="add-article-button">
                        <button onClick={handleAddArticleClick}>Ajouter un article</button>
                    </div>
                )}
                {isAdding && (
                    <div className="article-card">
                        <input
                            type="text"
                            value={newArticle.title}
                            placeholder="Titre de l'article"
                            onChange={(e) => handleInputChange(e, null, 'title')}
                        />
                        <textarea
                            value={newArticle.content}
                            placeholder="Contenu de l'article"
                            onChange={(e) => handleInputChange(e, null, 'content')}
                        />
                        <input
                            type="text"
                            value={newArticle.imageUrl}
                            placeholder="URL de l'image"
                            onChange={(e) => handleInputChange(e, null, 'imageUrl')}
                        />
                        <button onClick={handleSaveNewArticleClick}>Enregistrer</button>
                        <button onClick={handleCancelClick}>Annuler</button>
                    </div>
                )}
                {articles.length > 0 && (
    <>
        <div className="main-article" onClick={() => handleArticleClick(articles[0].id)}>
            {isEditing === articles[0].id ? (
                <>
                    <input
                        type="text"
                        value={articles[0].title}
                        onChange={(e) => handleInputChange(e, articles[0].id, 'title')}
                        placeholder="Titre de l'article"
                    />
                    <textarea
                        value={articles[0].content}
                        onChange={(e) => handleInputChange(e, articles[0].id, 'content')}
                        placeholder="Contenu de l'article"
                    />
                    <input
                        type="text"
                        value={articles[0].imageUrl}
                        onChange={(e) => handleInputChange(e, articles[0].id, 'imageUrl')}
                        placeholder="URL de l'image"
                    />
                </>
            ) : (
                <>
                    <h1 className="main-article-title">{articles[0].title}</h1>
                    <img src={getImagePath(articles[0].imageurl)} alt={articles[0].title} className="article-image" />
                    <h3 className="main-article-excerpt">{articles[0].content.substring(0, 200)}...</h3>
                </>
            )}
        </div>
        {isAdmin && isEditing !== articles[0].id && (
            <div className="article-edit-buttons">
                <button onClick={(e) => handleEditClick(articles[0].id, e)}>Modifier</button>
                <button onClick={() => handleDeleteClick(articles[0].id)}>Supprimer</button>
            </div>
        )}
        {isEditing === articles[0].id && (
            <div className="article-edit-buttons">
                <button onClick={() => handleSaveClick(articles[0].id)}>Enregistrer</button>
                <button onClick={handleCancelClick}>Annuler</button>
            </div>
        )}
    </>
)}

                <div className="articles-grid">
    {articles
        .slice(1)
        .map((article, index) => (
            <div key={article.id}>
                <div className="article-card" onClick={() => handleArticleClick(article.id)}>
                    {isEditing === article.id ? (
                        <>
                            <input
                                type="text"
                                value={article.title}
                                onChange={(e) => handleInputChange(e, article.id, 'title')}
                                placeholder="Titre de l'article"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <textarea
                                value={article.content}
                                onChange={(e) => handleInputChange(e, article.id, 'content')}
                                placeholder="Contenu de l'article"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <input
                                type="text"
                                value={article.imageUrl}
                                onChange={(e) => handleInputChange(e, article.id, 'imageUrl')}
                                placeholder="URL de l'image"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </>
                    ) : (
                        <div>
                            <h2 className="article-title">{article.title}</h2>
                            <img src={getImagePath(article.imageurl)} alt={article.title} className="article-image" />
                            <h3 className="article-excerpt">{article.content.substring(0, 100)}...</h3>
                        </div>
                    )}
                </div>
                {isAdmin && isEditing !== article.id && (
                    <div className="article-edit-buttons">
                        <button onClick={(e) => handleEditClick(article.id, e)}>Modifier</button>
                        <button onClick={() => handleDeleteClick(article.id)}>Supprimer</button>
                        <button onClick={() => moveArticleUp(index + 1)}>Monter</button> {/* Bouton Monter */}
                        <button onClick={() => moveArticleDown(index + 1)}>Descendre</button> {/* Bouton Descendre */}
                    </div>
                )}
                {isEditing === article.id && (
                    <div className="article-edit-buttons">
                        <button onClick={() => handleSaveClick(article.id)}>Enregistrer</button>
                        <button onClick={handleCancelClick}>Annuler</button>
                    </div>
                )}
            </div>
        ))}
</div>


            </div>
        </>
    );
};

export default Home;
