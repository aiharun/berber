import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ConfirmModal } from '../../components/ui/confirm-modal';
import { Modal } from '../../components/ui/modal';
import { Loader2, Plus, Edit2, Trash2, Scissors, Save, X } from 'lucide-react';
import { Service } from '../../context/BookingContext';

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'danger' | 'warning' | 'success';
    title: string;
    description: string;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
  }>({
    isOpen: false,
    type: 'warning',
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Hizmetler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setDuration('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEditClick = (service: Service) => {
    setName(service.name);
    setPrice(service.price.toString());
    setDuration(service.duration.toString());
    setEditingId(service.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !duration) return;

    const payload = {
      name,
      price: parseInt(price),
      duration: parseInt(duration)
    };

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('services')
          .insert([payload]);
          
        if (error) throw error;
      }
      
      resetForm();
      fetchServices();
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Başarılı',
        description: 'Hizmet başarıyla kaydedildi.',
        onConfirm: closeModal,
        cancelText: '' // Hide cancel button basically, or we can just let it have one
      });
    } catch (error) {
      console.error('Hizmet kaydedilirken hata:', error);
      setModalState({
        isOpen: true,
        type: 'danger',
        title: 'Hata',
        description: 'Hizmet kaydedilirken bir hata oluştu.',
        onConfirm: closeModal,
        cancelText: ''
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setModalState({
      isOpen: true,
      type: 'danger',
      title: 'Hizmeti Sil',
      description: 'Bu hizmeti kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      confirmText: 'Evet, Sil',
      cancelText: 'İptal',
      onConfirm: () => executeDelete(id)
    });
  };

  const executeDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchServices();
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Başarılı',
        description: 'Hizmet başarıyla silindi.',
        onConfirm: closeModal,
        cancelText: ''
      });
    } catch (error) {
      console.error('Hizmet silinirken hata:', error);
      setModalState({
        isOpen: true,
        type: 'danger',
        title: 'Hata',
        description: 'Hizmet silinirken bir hata oluştu.',
        onConfirm: closeModal,
        cancelText: ''
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Hizmet Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Sistemdeki tüm hizmetleri ve fiyatlarını buradan yönetebilirsiniz.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-stone-900 text-white hover:bg-amber-600 rounded-xl px-6 h-12 font-bold uppercase tracking-wide transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Yeni Hizmet Ekle
          </Button>
        )}
      </div>

      <Modal
        isOpen={isAdding}
        onClose={resetForm}
        title={editingId ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
        icon={<Scissors className="w-5 h-5 text-gold-600" />}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-foreground text-sm">Hizmet Adı</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Saç Kesimi"
                className="rounded-xl border-border py-6 focus-visible:ring-gold-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="font-semibold text-foreground text-sm">Fiyat (₺)</Label>
              <Input 
                id="price" 
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Örn: 350"
                className="rounded-xl border-border py-6 focus-visible:ring-gold-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="font-semibold text-foreground text-sm">Süre (Dakika)</Label>
              <Input 
                id="duration" 
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Örn: 45"
                className="rounded-xl border-border py-6 focus-visible:ring-gold-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 mt-6">
            <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl px-6 h-12 font-semibold">
              İptal
            </Button>
            <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-white rounded-xl px-8 h-12 font-bold transition-colors">
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </form>
      </Modal>

      <Card className="bg-white border border-border/60 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-medium">
              Henüz hiç hizmet eklenmemiş.
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {services.map(service => (
                <div key={service.id} className="flex items-center justify-between p-6 hover:bg-secondary/5 transition-colors">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{service.name}</h3>
                    <div className="flex items-center text-muted-foreground mt-1 text-sm font-medium">
                      <span className="text-gold-600 font-bold mr-4">₺{service.price}</span>
                      <span>{service.duration} Dakika</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(service)}
                      className="rounded-lg border-border hover:bg-secondary text-foreground font-medium h-10 px-4"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Düzenle
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClick(service.id)}
                      className="rounded-lg h-10 px-4 font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ConfirmModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        description={modalState.description}
        type={modalState.type}
        confirmText={modalState.cancelText === '' ? 'Tamam' : (modalState as any).confirmText || 'Onayla'}
        cancelText={modalState.cancelText}
      />
    </div>
  );
};

export default ServicesManagement;
