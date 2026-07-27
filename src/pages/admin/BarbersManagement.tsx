import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ConfirmModal } from '../../components/ui/confirm-modal';
import { Modal } from '../../components/ui/modal';
import { Loader2, Plus, Edit2, Trash2, User, Save, X } from 'lucide-react';
import { Barber } from '../../context/BookingContext';

const BarbersManagement = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

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

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error('Personeller yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const resetForm = () => {
    setName('');
    setPin('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEditClick = (barber: any) => {
    setName(barber.name);
    setPin(barber.pin || '');
    setEditingId(barber.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const payload = {
      name,
      pin: pin || null,
    };

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('barbers')
          .update(payload)
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('barbers')
          .insert([payload]);
          
        if (error) throw error;
      }
      
      resetForm();
      fetchBarbers();
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Başarılı',
        description: 'Personel başarıyla kaydedildi.',
        onConfirm: closeModal,
        cancelText: ''
      });
    } catch (error) {
      console.error('Personel kaydedilirken hata:', error);
      setModalState({
        isOpen: true,
        type: 'danger',
        title: 'Hata',
        description: 'Personel kaydedilirken bir hata oluştu.',
        onConfirm: closeModal,
        cancelText: ''
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setModalState({
      isOpen: true,
      type: 'danger',
      title: 'Personeli Sil',
      description: 'Bu personeli kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      confirmText: 'Evet, Sil',
      cancelText: 'İptal',
      onConfirm: () => executeDelete(id)
    });
  };

  const executeDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('barbers')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchBarbers();
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Başarılı',
        description: 'Personel başarıyla silindi.',
        onConfirm: closeModal,
        cancelText: ''
      });
    } catch (error) {
      console.error('Personel silinirken hata:', error);
      setModalState({
        isOpen: true,
        type: 'danger',
        title: 'Hata',
        description: 'Personel silinirken bir hata oluştu.',
        onConfirm: closeModal,
        cancelText: ''
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Personel Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Dükkanda çalışan berberleri/personelleri buradan yönetebilirsiniz.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-stone-900 text-white hover:bg-amber-600 rounded-xl px-6 h-12 font-bold uppercase tracking-wide transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Yeni Personel Ekle
          </Button>
        )}
      </div>

      <Modal
        isOpen={isAdding}
        onClose={resetForm}
        title={editingId ? 'Personeli Düzenle' : 'Yeni Personel Ekle'}
        icon={<User className="w-5 h-5 text-gold-600" />}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-foreground text-sm">Personel Adı</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="rounded-xl border-border py-6 focus-visible:ring-gold-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin" className="font-semibold text-foreground text-sm">Giriş PIN Kodu (6 Hane)</Label>
              <Input 
                id="pin" 
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Örn: 123456"
                className="rounded-xl border-border py-6 focus-visible:ring-gold-500 tracking-widest font-mono text-lg"
              />
              <p className="text-xs text-muted-foreground">Personelin sisteme giriş yapabilmesi için isteğe bağlıdır.</p>
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
          ) : barbers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-medium">
              Henüz hiç personel eklenmemiş.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {barbers.map(barber => (
                <div key={barber.id} className="flex flex-col items-center p-6 border border-border rounded-xl hover:border-gold-500/50 hover:shadow-sm transition-all group bg-secondary/10">
                  <div className="w-20 h-20 bg-white border border-border rounded-full flex items-center justify-center shadow-sm mb-4">
                    <User className="w-8 h-8 text-gold-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{barber.name}</h3>
                  {/* @ts-ignore */}
                  {barber.pin && <p className="text-sm font-mono tracking-widest text-gold-600 font-bold mb-4">PIN: {barber.pin}</p>}
                  {!barber.pin && <p className="text-sm text-muted-foreground mb-4 italic">Giriş yetkisi yok</p>}
                  <div className="flex items-center space-x-2 w-full mt-auto">
                    <Button 
                      variant="outline" 
                      onClick={() => handleEditClick(barber)}
                      className="flex-1 rounded-lg border-border hover:bg-white text-foreground font-medium h-10"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Düzenle
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteClick(barber.id)}
                      className="flex-1 rounded-lg h-10 font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
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
        confirmText={modalState.cancelText === '' ? 'Tamam' : modalState.confirmText || 'Onayla'}
        cancelText={modalState.cancelText}
      />
    </div>
  );
};

export default BarbersManagement;
