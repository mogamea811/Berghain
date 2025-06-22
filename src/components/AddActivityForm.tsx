import React, { useState } from 'react';

const AddActivityForm = () => {
    const [formData, setFormData] = useState({
        destination: '',
        name: '',
        lat: '',
        lon: '',
        rating: '',
        ratings_total: '',
        place_id: '',
        category: '',
        price: '',
        duration: '',
        url: '',
        affiliateLink: '',
        availabilityType: 'opening_hours',
        opening_hours: {
            Monday: { opening_time: '', closing_time: '' },
            Tuesday: { opening_time: '', closing_time: '' },
            Wednesday: { opening_time: '', closing_time: '' },
            Thursday: { opening_time: '', closing_time: '' },
            Friday: { opening_time: '', closing_time: '' },
            Saturday: { opening_time: '', closing_time: '' },
            Sunday: { opening_time: '', closing_time: '' },
        },
        available_slots: '',
    });
    console.log(formData)

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        console.log(event.target)
        if (name.startsWith('opening_hours')) {
            const [_, day, time] = name.match(/opening_hours\[(.*?)\]\[(.*?)\].*/);
            setFormData(prevFormData => ({
                ...prevFormData,
                opening_hours: {
                    ...prevFormData.opening_hours,
                    [day]: {
                        ...prevFormData.opening_hours[day],
                        [time]: value,
                    },
                },
            }));
        } else if (name === 'availabilityType') {
            setFormData(prevFormData => ({
                ...prevFormData,
                availabilityType: value,
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const activityData = { ...formData };
        console.log("data before",activityData)
        // Handle availability based on selected type
        if (activityData.availabilityType === 'slots' && activityData.available_slots) {
            activityData.available_slots = activityData.available_slots.split('\n').map(slot => slot.trim()).filter(slot => slot !== '');
            delete activityData.opening_hours;
        } else if (activityData.availabilityType === 'opening_hours') {
            delete activityData.available_slots;
        }
        console.log("data after",activityData)

        // Rename keys to snake_case for the backend request body
        const requestBody = {
            destination: activityData.destination,
            name: activityData.name,
            lat: activityData.lat ? parseFloat(activityData.lat) : null,
            lon: activityData.lon ? parseFloat(activityData.lon) : null,
            rating: activityData.rating ? parseFloat(activityData.rating) : null,
            ratings_total: activityData.ratings_total ? parseInt(activityData.ratings_total) : null,
            place_id: activityData.place_id || null,
            category: activityData.category || null,
            price: activityData.price ? parseFloat(activityData.price) : null,
            duration: activityData.duration ? parseFloat(activityData.duration) : null,
            url: activityData.url || null,
            affiliate_link: activityData.affiliateLink || null, // Now in snake_case
            opening_hours: activityData.availabilityType === 'opening_hours' ? {
                Monday: activityData.opening_hours.Monday ? {
                    opening_time: activityData.opening_hours.Monday.opening_time || null,
                    closing_time: activityData.opening_hours.Monday.closing_time || null,
                } : null,
                Tuesday: activityData.opening_hours.Tuesday ? {
                    opening_time: activityData.opening_hours.Tuesday.opening_time || null,
                    closing_time: activityData.opening_hours.Tuesday.closing_time || null,
                } : null,
                Wednesday: activityData.opening_hours.Wednesday ? {
                    opening_time: activityData.opening_hours.Wednesday.opening_time || null,
                    closing_time: activityData.opening_hours.Wednesday.closing_time || null,
                } : null,
                Thursday: activityData.opening_hours.Thursday ? {
                    opening_time: activityData.opening_hours.Thursday.opening_time || null,
                    closing_time: activityData.opening_hours.Thursday.closing_time || null,
                } : null,
                Friday: activityData.opening_hours.Friday ? {
                    opening_time: activityData.opening_hours.Friday.opening_time || null,
                    closing_time: activityData.opening_hours.Friday.closing_time || null,
                } : null,
                Saturday: activityData.opening_hours.Saturday ? {
                    opening_time: activityData.opening_hours.Saturday.opening_time || null,
                    closing_time: activityData.opening_hours.Saturday.closing_time || null,
                } : null,
                Sunday: activityData.opening_hours.Sunday ? {
                    opening_time: activityData.opening_hours.Sunday.opening_time || null,
                    closing_time: activityData.opening_hours.Sunday.closing_time || null,
                } : null,
            } : null,
            available_slots: activityData.availabilityType === 'slots' ? activityData.available_slots : null,
        };

        console.log('Activity Data to Send (snake_case):', requestBody);

        try {
            const backendApiUrl = 'http://localhost:8000/activities'; // Your updated API endpoint
            const response = await fetch(backendApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
                alert('Activity added successfully!');
                // setFormData({ // Reset the form
                //     destination: '',
                //     name: '',
                //     lat: '',
                //     lon: '',
                //     rating: '',
                //     ratings_total: '',
                //     place_id: '',
                //     category: '',
                //     price: '',
                //     duration: '',
                //     url: '',
                //     affiliateLink: '',
                //     availabilityType: 'opening_hours',
                //     opening_hours: {
                //         Monday: { opening_time: '', closing_time: '' },
                //         Tuesday: { opening_time: '', closing_time: '' },
                //         Wednesday: { opening_time: '', closing_time: '' },
                //         Thursday: { opening_time: '', closing_time: '' },
                //         Friday: { opening_time: '', closing_time: '' },
                //         Saturday: { opening_time: '', closing_time: '' },
                //         Sunday: { opening_time: '', closing_time: '' },
                //     },
                //     available_slots: '',
                // });
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Failed to add activity.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the backend API.');
        }
    };
    return (
        <div>
            <h1>Add New Activity</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="destination">Destination:</label>
                    <input type="text" id="destination" name="destination" value={formData.destination} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="lat">Latitude:</label>
                    <input type="number" id="lat" name="lat" step="any" value={formData.lat} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="lon">Longitude:</label>
                    <input type="number" id="lon" name="lon" step="any" value={formData.lon} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <input type="number" id="rating" name="rating" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="ratings_total">Total Ratings:</label>
                    <input type="number" id="ratings_total" name="ratings_total" min="0" value={formData.ratings_total} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="place_id">Place ID (Google Places ID):</label>
                    <input type="text" id="place_id" name="place_id" value={formData.place_id} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" name="price" step="0.01" min="0" value={formData.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duration (in hours):</label>
                    <input type="number" id="duration" name="duration" step="0.1" min="0" value={formData.duration} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="url">URL:</label>
                    <input type="url" id="url" name="url" value={formData.url} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="affiliateLink">Affiliate Link:</label>
                    <input type="url" id="affiliateLink" name="affiliateLink" value={formData.affiliateLink} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Availability:</label>
                    <div>
                        <input
                            type="radio"
                            id="useOpeningHours"
                            name="availabilityType"
                            value="opening_hours"
                            checked={formData.availabilityType === 'opening_hours'}
                            onChange={handleChange}
                        />
                        <label htmlFor="useOpeningHours">Opening Hours</label>
                        <input
                            type="radio"
                            id="useSlots"
                            name="availabilityType"
                            value="slots"
                            checked={formData.availabilityType === 'slots'}
                            onChange={handleChange}
                        />
                        <label htmlFor="useSlots">Available Slots</label>
                    </div>
                </div>

                {formData.availabilityType === 'opening_hours' && (
                    <div id="openingHoursSection" className="opening-hours-section">
                        <h3>Opening Hours</h3>
                        {Object.keys(formData.opening_hours).map(day => (
                            <div className="day-slots" key={day}>
                                <label>{day}:</label>
                                <div className="slot-pair">
                                    <label>Open:</label>
                                    <input
                                        type="time"
                                        name={`opening_hours[${day}][opening_time]`}
                                        value={formData.opening_hours[day].opening_time}
                                        onChange={handleChange}
                                    />
                                    <label>Close:</label>
                                    <input
                                        type="time"
                                        name={`opening_hours[${day}][closing_time]`}
                                        value={formData.opening_hours[day].closing_time}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {formData.availabilityType === 'slots' && (
                    <div id="slotsSection" className="slots-section">
                        <h3>Available Slots</h3>
                        <label htmlFor="available_slots">Enter available time slots (one per line, e.g., "9:00 AM - 10:00 AM"):</label>
                        <textarea
                            id="available_slots"
                            name="available_slots"
                            rows="5"
                            value={formData.available_slots}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <button type="submit">Add Activity</button>
            </form>

            <style jsx>{`
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input[type="text"],
                input[type="number"],
                input[type="url"],
                textarea,
                select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                input[type="checkbox"] {
                    margin-right: 5px;
                }
                .opening-hours-section, .slots-section {
                    border: 1px solid #eee;
                    padding: 10px;
                    margin-top: 10px;
                    border-radius: 4px;
                }
                .day-slots {
                    margin-bottom: 10px;
                }
                .slot-pair {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 5px;
                }
                .slot-pair input {
                    width: auto;
                }
                button {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background-color: #0056b3;
                }
            `}</style>
        </div>
    );
};

export default AddActivityForm;