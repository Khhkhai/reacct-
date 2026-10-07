import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import React, { useState, useEffect, useRef } from "react"
import { Modal } from "../components/Modal";
import { Input } from "../components/InputFields/Input";
import { FileInput, type FileInputHandle } from "../components/InputFields/FileInput";
import { BACKEND_PORT } from '../../backend.config.json'
import { Card } from '../components/Card'
import { useErrorModal } from "../utils/useErrorModal";
import { getStore, createPresentation } from "../api/store"
import { fileToDataUrl } from "../utils/file"
import type { PresentationType, SolidBackground } from "../data"
import axios from 'axios';

type StorePresentation = Omit<PresentationType, "id">;

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { showError } = useErrorModal();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [presentations, setPresentations] = useState<PresentationType[]>([]);
  const fileInputRef = useRef<FileInputHandle>(null);
  const createId = () => Date.now().toString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Record<string, StorePresentation> = await getStore();
        const arr: PresentationType[] = Object.entries(data || {}).map(
          ([id, value]) => ({
            id,
            ...value,
          })
        );
        setPresentations(arr);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          showError(error.response?.data?.error || "Something went wrong");
        } else {
          showError("Unexpected error");
        }
      }
    };
    fetchData();
  }, []);

  // logout function
  const logout = async() => {
    try {
      await axios.post(`http://localhost:${BACKEND_PORT}/admin/auth/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data?.error || "Something went wrong");
      } else {
        showError("Unexpected error");
      }
    }
    localStorage.clear();
    navigate('/')
  }

  const resetForm = () => {
    setName('');
    setDescription('');
    setThumbnail(null);
    fileInputRef.current?.reset();
  };

  // create a presentation
  const handleCreate = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let thumbnailBase64 = null
      if (thumbnail) {
        thumbnailBase64 = await fileToDataUrl(thumbnail) as string;
      }
      const newPresentation = {
        id: createId(),
        name,
        description,
        thumbnail: thumbnailBase64,
        slides: [
          {
            id: createId(),
            elements: [],
          }
        ],
        defaultBackground: {
          type: "solid",
          color: "white"
        } as SolidBackground
      };
      await createPresentation(newPresentation);
      setPresentations(prev => [...prev, newPresentation]);
      setCreateModalOpen(false);
      resetForm();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data?.error || "Something went wrong");
      } else {
        showError("Unexpected error");
      }
    }
  }

  return (  
    <>
      <nav className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div onClick={() =>  navigate('/dashboard')} className='text-xl cursor-pointer'>Presto</div>
        </div>
        <div className="navbar-end gap-2">
          <Button name="new-presentation" onClick={() => setCreateModalOpen(true)}>New presentation</Button>
          <Button name="logout" onClick={logout}>logout</Button>
        </div>
      </nav>
      <div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-3'>
          {presentations.map((p) => (
            <Card
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              thumbnail={p.thumbnail}
              slides={p.slides}
              onClick={() => navigate(`/presentation/${p.id}`)}
            />
          ))}
        </div>
      </div>
      
      <Modal open={createModalOpen} title="Create a new presentation" 
        onClose={() => {
          setCreateModalOpen(false);
          resetForm();
        }} 
      >
        <form onSubmit={handleCreate} className="fieldset w-xs p-4">
          <Input name='name' id="name" label="Name" type="text" value={name} onChange={setName} required={true}/> 
          <Input name='description' id="description" label="Description" type="text" value={description} onChange={setDescription} required={true}/> 
          <FileInput name='thumbnail' ref={fileInputRef} id="thumbnail" label="Thumbnail" type="file" onChange={setThumbnail} accept="image/png, image/jpeg"/>
          <div className="flex justify-end gap-2">
            <Button name="cancel" onClick={() => { setCreateModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button name="create" type="submit">Create</Button> 
          </div>    
        </form>
      </Modal>
    </>
  );
};