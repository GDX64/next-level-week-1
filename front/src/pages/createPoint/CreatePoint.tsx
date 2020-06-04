import React, { useEffect, useState, ChangeEvent, HtmlHTMLAttributes, FormEvent } from 'react'
import './styles.css'
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'
import logo from '../../assets/logo.svg'
import api from '../../services/api'
import axios from 'axios';

interface Item {
    id: number,
    title: string,
    imageURI: string
}

interface FormData {
    name: string,
    email: string,
    whatsapp: string
}

interface IBGEUFResponse {
    sigla: string
}

interface City {
    nome: string
}
//========Component Function===========

function CreatePoint() {

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', whatsapp: '' })
    const [selectedUF, setSelectedUF] = useState<string>('0')
    const [selectedCity, setCity] = useState<string>('')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedItems, setSelectedItems] = useState<any>({})

    const history = useHistory()

    useEffect(() => {
        api.get('items').then((res) => {
            setItems(res.data)
        })

        axios.get<IBGEUFResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`).then((res) => {
            const ufInitials = res.data.map(uf => uf.sigla)
            setUfs(ufInitials);
        })


    }, [])

    useEffect(() => {
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
            .then((res) => {
                console.log(res);
                setCities(res.data)
            })

    }, [selectedUF])


    //===== Handles =========

    function handleUFChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUF(event.target.value)
    }

    function handleCityChange(event: ChangeEvent<HTMLSelectElement>) {
        setCity(event.target.value)
    }

    function handleMouseClick(event: LeafletMouseEvent) {
        const { lat, lng } = event.latlng
        console.log(lat, lng);

        setSelectedPosition([lat, lng])
    }

    function handleForm(event: ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [event.target.name]: event.target.value })

    }

    function handleSelectedItem(id: number) {
        let itemsCopy = selectedItems;
        if (Object.keys(selectedItems).includes(String(id))) {
            delete (itemsCopy[String(id)])
        } else itemsCopy[id] = true;

        setSelectedItems({ ...itemsCopy })
        console.log(id, selectedItems);
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const sendForm = {
            ...formData,
            uf: selectedUF,
            city: selectedCity,
            latitude: selectedPosition[0],
            longitude: selectedPosition[1],
            items: Object.keys(selectedItems)
        }

        console.log(sendForm)
        api.post('/points', sendForm).then(() => {
            alert('Point created')
            history.push('/')
        })
    }
    //=============Return==========
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form action="" onSubmit={handleSubmit}>
                <h1>Cadastro do ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleForm} />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" id="email" value={formData.email} onChange={handleForm} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" value={formData.whatsapp} onChange={handleForm} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-22.4395087, -44.363783]} zoom={15} onClick={handleMouseClick}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Marker position={selectedPosition}>
                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">UF</label>
                            <select name="uf" id="uf" value={selectedUF} onChange={handleUFChange}>
                                {ufs.map((uf, index) => (
                                    <option key={index} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleCityChange} value={selectedCity}>
                                {cities.map((item, index) => (
                                    <option key={index} value={item.nome}>{item.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítems de coleta</h2>
                        <span>Selecione um ou mais ítems</span>
                    </legend>
                    <ul className="items-grid">

                        {items.map((item, index) => {
                            return <li key={index} onClick={() => handleSelectedItem(index)}
                                className={selectedItems[index] ? 'selected' : ''}>
                                <img src={item.imageURI} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        })}

                    </ul>
                </fieldset>
                <button type="submit">Criar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint