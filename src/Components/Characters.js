import React, { useEffect, useState } from "react";
import './Characters.css';

const Characters = () => {
    const [char, setChar] = useState([]);
    const [modal, setModal] = useState(false);
    const [details, setDetails] = useState(null);
    const [films, setFilms] = useState(null);
    const [page, setPage] = useState(1);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);

    useEffect(() => {
        const fetchChars = async () => {
            try {
                const res = await fetch(`https://swapi.dev/api/people/?page=${page}`);

                if (!res.ok) {
                    throw new Error('something went wrong');
                }

                const data = await res.json();

                const Chars = [];
                let idCounter = ((page-1)*10)+1; 

                for (const key in data.results) {
                    let id;
                    id=idCounter
                    Chars.push({
                        id: id,
                        name: data.results[key].name
                    });

                    idCounter++; 
                }


                setChar(Chars);
                console.log(Chars)
                setPrev(data.previous);
                setNext(data.next);
                
            } catch (err) {
                console.log(err);
            }
        };

        fetchChars();
        
    }, [page]);

    const ShowDetails = async (id) => {
        try {
            const res= await fetch(`https://swapi.dev/api/people/${id}/`);

            if(!res.ok){
                throw new Error('could not fetch details');
            }

            const data= await res.json();
            setDetails(data);

            const filmsData = await Promise.all(data.films.map(async (filmUrl) => {
                const filmRes = await fetch(filmUrl);
                if (!filmRes.ok) {
                    throw new Error('Could not fetch details for film');
                }
                return filmRes.json();
            }));

            const filmsTitles = filmsData.map((film) => film.title);
            setFilms(filmsTitles);
            setModal(true);

        } catch(err) {
            console.log(err);
        }
    };

    const closeModal = () => {
        setModal(false);
    };

    const goToPrevPage = () => {
        if (prev) {
            const pageNumber = prev.match(/page=(\d+)/)[1];
            console.log(pageNumber)
            setPage(pageNumber);
        }
    };

    const goToNextPage = () => {
        if (next) {
            const pageNumber = next.match(/page=(\d+)/)[1];
            setPage(pageNumber);
        }
    };

    return (
        <div>
            <h1 className="title">Characters in Star Wars</h1>
            <ul>
                {char.map((c) => (
                    <li key={c.id}>
                        <span className="name">{c.name}</span>
                        <button className="details-bttn" onClick={() => ShowDetails(c.id)}>Details</button>
                    </li>
                ))}
            </ul>
            {modal && details && (
                <div>
                    <div className="backdrop" onClick={closeModal}></div>
                    <div className="modal">
                        <div className="modal-content">
                            <p>Name: {details.name}</p>
                            <p>Height: {details.height}</p>
                            <p>Mass: {details.mass}</p>
                            <p>Gender: {details.gender}</p>
                            <h2 className="films">Films {details.name} has appeared in</h2>
                            <ul>
                                {films.map((film, index) => (
                                    <li key={index}>{film}</li>
                                ))}
                            </ul>
                            <span className="close-btn" onClick={closeModal}>X</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="pagination">
                {prev && <button onClick={goToPrevPage}>Previous</button>}
                {next && <button onClick={goToNextPage}>Next</button>}
            </div>
        </div>
    );
};

export default Characters;
