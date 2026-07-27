import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'
import Sidebar from '../../../components/ui/Sidebar'
import Typography from '../../../components/ui/Typography'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import * as productService from '../services/productService'

export default function ProductListView() {
  const handleSidebarNavigate = useSidebarNavigate()
  const [activeTab, setActiveTab] = useState('utama') // 'utama' | 'tambahan'
  
  // Data lists from localStorage DB
  const [layananUtama, setLayananUtama] = useState([])
  const [layananTambahan, setLayananTambahan] = useState([])
  const [loading, setLoading] = useState(true)

  // Floating Dropdowns & Modals State
  const [activeMenuId, setActiveMenuId] = useState(null) // ID of active three-dot menu dropdown
  const [activeMenuType, setActiveMenuType] = useState(null) // 'utama' | 'tambahan'
  
  const [activeModal, setActiveModal] = useState(null) // null | 'tambah_utama' | 'edit_utama' | 'tambah_tambahan' | 'edit_tambahan' | 'tambah_spesifik' | 'edit_spesifik'
  const [deleteConfirm, setDeleteConfirm] = useState(null) // null | { type, id, extraId, message }
  
  // Form payloads
  const [selectedItem, setSelectedItem] = useState(null) // currently editing object
  const [utamaForm, setUtamaForm] = useState({ name: '', description: '', price: '', unit: 'Kg' })
  const [tambahanForm, setTambahanForm] = useState({ name: '' })
  const [spesifikForm, setSpesifikForm] = useState({ groupId: '', name: '', price: '', unit: 'Pcs' })
  
  // Form validation errors
  const [errors, setErrors] = useState({})
  
  // Dropdown states for custom selects
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false)
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false)
  const [showNewGroupInput, setShowNewGroupInput] = useState(false)
  const [newGroupNameInline, setNewGroupNameInline] = useState('')

  // Load database items
  const loadData = async () => {
    try {
      setLoading(true)
      const dataUtama = await productService.getLayananUtama()
      const dataTambahan = await productService.getLayananTambahan()
      setLayananUtama(dataUtama)
      setLayananTambahan(dataTambahan)
    } catch (err) {
      console.error('Failed to load services data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuId(null)
      setActiveMenuType(null)
    }
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [])

  // --- Actions & Modal Handling ---
  
  // 1. Primary Service CRUD
  const handleOpenUtamaModal = (service = null) => {
    setErrors({})
    setUnitDropdownOpen(false)
    if (service) {
      setSelectedItem(service)
      setUtamaForm({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        unit: service.unit
      })
      setActiveModal('edit_utama')
    } else {
      setSelectedItem(null)
      setUtamaForm({ name: '', description: '', price: '', unit: 'Kg' })
      setActiveModal('tambah_utama')
    }
  }

  const handleSaveUtama = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!utamaForm.name.trim()) errs.name = 'Nama layanan wajib diisi'
    if (!utamaForm.price.trim() || isNaN(Number(utamaForm.price))) errs.price = 'Harga wajib diisi'
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    try {
      if (activeModal === 'edit_utama') {
        await productService.updateLayananUtama(selectedItem.id, utamaForm)
      } else {
        await productService.createLayananUtama(utamaForm)
      }
      setActiveModal(null)
      await loadData()
    } catch (err) {
      console.error(err)
    }
  }

  // Hide/Show toggles
  const handleToggleHideUtama = async (id, currentStatus) => {
    try {
      await productService.updateLayananUtama(id, { status: !currentStatus })
      await loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleHideTambahanGroup = async (id, currentStatus) => {
    try {
      await productService.updateLayananTambahanGroup(id, { status: !currentStatus })
      await loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteUtama = (id) => {
    setDeleteConfirm({
      type: 'utama',
      id,
      message: 'Apakah Anda yakin ingin menghapus layanan utama ini? Tindakan ini tidak dapat dibatalkan.'
    })
  }

  // 2. Additional Service Group CRUD
  const handleOpenTambahanGroupModal = (group = null) => {
    setErrors({})
    setUnitDropdownOpen(false)
    if (group) {
      setSelectedItem(group)
      setTambahanForm({ name: group.name })
      setActiveModal('edit_tambahan')
    } else {
      setSelectedItem(null)
      setSpesifikForm({ groupId: '', groupNameText: '', name: '', price: '', unit: 'Pcs' })
      setActiveModal('tambah_tambahan')
    }
  }

  const handleSaveTambahanGroup = async (e) => {
    e.preventDefault()
    if (activeModal === 'edit_tambahan') {
      if (!tambahanForm.name.trim()) {
        setErrors({ name: 'Nama kelompok layanan tambahan wajib diisi' })
        return
      }

      try {
        await productService.updateLayananTambahanGroup(selectedItem.id, tambahanForm)
        setActiveModal(null)
        await loadData()
      } catch (err) {
        console.error(err)
      }
    } else {
      // Adding additional service layout from Tambah Layanan Tambahan.png mockup
      const errs = {}
      if (!spesifikForm.groupNameText.trim()) errs.groupNameText = 'Pilih Layanan Tambahan wajib diisi'
      if (!spesifikForm.name.trim()) errs.name = 'Nama Layanan Spesifik wajib diisi'
      if (!spesifikForm.price.trim() || isNaN(Number(spesifikForm.price))) errs.price = 'Harga wajib berupa angka'

      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }

      try {
        // Find if additional group exists or create new
        const existing = layananTambahan.find(
          (x) => x.name.toLowerCase() === spesifikForm.groupNameText.trim().toLowerCase()
        )
        let targetGroupId
        if (existing) {
          targetGroupId = existing.id
        } else {
          const newGroup = await productService.createLayananTambahanGroup(spesifikForm.groupNameText.trim())
          targetGroupId = newGroup.id
        }

        // Add nested specific item inside
        await productService.createLayananSpesifik(targetGroupId, {
          name: spesifikForm.name,
          price: spesifikForm.price,
          unit: spesifikForm.unit
        })

        setActiveModal(null)
        await loadData()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleDeleteTambahanGroup = (id) => {
    setDeleteConfirm({
      type: 'tambahan',
      id,
      message: 'Apakah Anda yakin ingin menghapus kelompok layanan tambahan ini beserta seluruh item spesifik di dalamnya? Tindakan ini tidak dapat dibatalkan.'
    })
  }

  // 3. Specific Pricing Option inside Additional Service CRUD
  const handleOpenSpesifikModal = (group = null, item = null) => {
    setErrors({})
    setGroupDropdownOpen(false)
    setShowNewGroupInput(false)
    setNewGroupNameInline('')
    
    if (item && group) {
      setSelectedItem(item)
      setSpesifikForm({
        groupId: group.id,
        name: item.name,
        price: item.price.toString(),
        unit: item.unit
      })
      setActiveModal('edit_spesifik')
    } else {
      setSelectedItem(null)
      setSpesifikForm({
        groupId: group ? group.id : (layananTambahan[0]?.id || ''),
        name: '',
        price: '',
        unit: 'Pcs'
      })
      setActiveModal('tambah_spesifik')
    }
  }

  const handleSaveSpesifik = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!spesifikForm.groupId && !showNewGroupInput) errs.groupId = 'Silakan pilih kelompok tambahan'
    if (showNewGroupInput && !newGroupNameInline.trim()) errs.newGroupName = 'Nama kelompok baru wajib diisi'
    if (!spesifikForm.name.trim()) errs.name = 'Nama item spesifik wajib diisi'
    if (!spesifikForm.price.trim() || isNaN(Number(spesifikForm.price))) errs.price = 'Harga wajib berupa angka'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    try {
      let targetGroupId = spesifikForm.groupId
      
      // Create group inline if requested (+ Tambah layanan tambahan)
      if (showNewGroupInput) {
        const newGroup = await productService.createLayananTambahanGroup(newGroupNameInline.trim())
        targetGroupId = newGroup.id
      }

      if (activeModal === 'edit_spesifik') {
        // Find parent group of the item being edited
        const oldGroupId = layananTambahan.find(g => g.items.some(it => it.id === selectedItem.id))?.id
        if (oldGroupId === targetGroupId) {
          await productService.updateLayananSpesifik(targetGroupId, selectedItem.id, spesifikForm)
        } else {
          // Re-route item to new group
          await productService.deleteLayananSpesifik(oldGroupId, selectedItem.id)
          await productService.createLayananSpesifik(targetGroupId, spesifikForm)
        }
      } else {
        await productService.createLayananSpesifik(targetGroupId, spesifikForm)
      }
      setActiveModal(null)
      await loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteSpesifik = (groupId, itemId) => {
    setDeleteConfirm({
      type: 'spesifik',
      id: itemId,
      extraId: groupId,
      message: 'Apakah Anda yakin ingin menghapus item spesifik ini? Tindakan ini tidak dapat dibatalkan.'
    })
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left Sidebar */}
      <Sidebar activeItemId="layanan" onItemClick={handleSidebarNavigate} />

      {/* Main Container */}
      <main className="flex-1 p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6 overflow-y-auto">
        
        {/* Header Layout */}
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-[32px] font-bold text-on-surface font-sans leading-tight">Layanan</h1>
            <p className="text-body-md text-on-surface-variant/80 font-medium mt-1">
              Kelola layanan laundry yang tersedia untuk pelanggan.
            </p>
          </div>
          
          {/* Notification Button */}
          <button className="w-11 h-11 bg-white border border-outline-variant/40 rounded-full flex items-center justify-center relative shadow-xs cursor-pointer hover:bg-surface-container transition-all">
            <Icon name="notifications" size={22} className="text-on-surface-variant" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border border-white"></span>
          </button>
        </header>

        {/* Content Box Panel */}
        <section className="bg-white border border-outline-variant/30 rounded-3xl shadow-md p-6.5 flex-1 flex flex-col min-h-[500px]">
          
          {/* Tabs Navigation */}
          <div className="flex justify-center border-b border-outline-variant/30 mb-6 font-sans">
            <button
              onClick={() => setActiveTab('utama')}
              className={`px-8 py-3.5 text-label-lg font-bold transition-all relative border-b-2 -mb-[2px] cursor-pointer ${
                activeTab === 'utama' 
                  ? 'text-primary border-primary' 
                  : 'text-on-surface-variant/50 border-transparent hover:text-on-surface-variant'
              }`}
            >
              Layanan Utama
            </button>
            <button
              onClick={() => setActiveTab('tambahan')}
              className={`px-8 py-3.5 text-label-lg font-bold transition-all relative border-b-2 -mb-[2px] cursor-pointer ${
                activeTab === 'tambahan' 
                  ? 'text-primary border-primary' 
                  : 'text-on-surface-variant/50 border-transparent hover:text-on-surface-variant'
              }`}
            >
              Layanan Tambahan
            </button>
          </div>

          {/* Sub-Pane Loading / Empty / populated state */}
          <div className="flex-1 flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <span className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
                <p className="text-body-md text-on-surface-variant/70 font-semibold">Memuat layanan...</p>
              </div>
            ) : activeTab === 'utama' ? (
              
              // --- LAYANAN UTAMA SECTION ---
              layananUtama.length === 0 ? (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="mb-6 relative">
                    <svg viewBox="0 0 200 200" className="w-56 h-56 text-primary">
                      {/* Stacked drawer boxes illustration */}
                      <rect x="70" y="90" width="70" height="70" fill="#004d62" rx="6" />
                      <circle cx="105" cy="125" r="5" fill="#ffffff" />
                      <rect x="75" y="45" width="60" height="42" fill="#003543" rx="6" />
                      <circle cx="105" cy="66" r="4" fill="#ffffff" />
                      {/* Pensive girl figure */}
                      <path d="M40 70 C40 50, 60 50, 60 70 L55 140 L45 140 Z" fill="#0a6780" />
                      <circle cx="50" cy="45" r="12" fill="#ffdea4" />
                      <path d="M40 45 C40 35, 60 35, 60 45 Z" fill="#171d1e" />
                      {/* Exclamation Bubble */}
                      <circle cx="115" cy="25" r="14" fill="#eff5f6" stroke="#0a6780" strokeWidth="2" />
                      <text x="115" y="30" textAnchor="middle" fill="#0a6780" fontWeight="bold" fontSize="16">!</text>
                      {/* Plant pot */}
                      <rect x="155" y="120" width="16" height="20" fill="#70787c" rx="2" />
                      <line x1="163" y1="120" x2="163" y2="90" stroke="#70787c" strokeWidth="2" />
                      <circle cx="163" cy="85" r="5" fill="#2d6a44" />
                      <circle cx="156" cy="98" r="4.5" fill="#2d6a44" />
                      <circle cx="170" cy="108" r="4.5" fill="#2d6a44" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-on-surface font-sans mb-1.5">Tambahkan Layanan Dulu!</h2>
                  <p className="text-body-md text-on-surface-variant/70 font-semibold max-w-sm">
                    Silahkan tekan tombol layanan, untuk menambahkan layanan
                  </p>
                </div>
              ) : (
                /* Populated List */
                <div className="flex flex-col gap-4">
                  {layananUtama.map((service) => (
                    <div
                      key={service.id}
                      className={`border border-outline-variant/40 rounded-2xl p-5 flex flex-col transition-all bg-white hover:shadow-sm ${
                        !service.status ? 'opacity-55' : ''
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1 pr-6 text-left">
                           <h3 className="text-lg font-bold text-on-surface font-sans flex items-center gap-2">
                            {service.name}
                            {!service.status && (
                              <Icon name="visibility_off" size={16} className="text-on-surface-variant/60" />
                            )}
                          </h3>
                          <p className="text-body-sm font-semibold text-on-surface-variant/80 mt-1 max-w-[700px] leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        {/* Right Panel Alignment */}
                        <div className="flex items-center gap-8">
                          <span className="text-xl font-bold text-primary font-sans">
                            Rp. {service.price.toLocaleString('id-ID')} <span className="text-body-sm font-medium text-on-surface-variant">/ {service.unit}</span>
                          </span>

                          <div className="flex items-center gap-3">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenUtamaModal(service)}
                              className="border border-outline-variant/60 rounded-xl px-4 py-2 text-label-md font-bold text-on-surface-variant flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer bg-white"
                            >
                              <Icon name="edit" size={18} />
                              <span>Edit</span>
                            </button>

                            {/* Action vertical menu */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveMenuType('utama')
                                  setActiveMenuId(activeMenuId === service.id ? null : service.id)
                                }}
                                className="w-10 h-10 hover:bg-surface-container rounded-xl flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
                              >
                                <Icon name="more_vert" size={22} />
                              </button>

                              {activeMenuType === 'utama' && activeMenuId === service.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 mt-1 w-56 bg-white border border-outline-variant/40 rounded-2xl shadow-lg py-2.5 z-10 font-sans"
                                >
                                  <button
                                    onClick={() => {
                                      handleOpenSpesifikModal(service)
                                      setActiveMenuId(null)
                                    }}
                                    className="w-full text-left px-4.5 py-2.5 text-label-md font-bold text-on-surface hover:bg-surface-container flex items-center gap-3 cursor-pointer"
                                  >
                                    <Icon name="add" size={18} className="text-on-surface-variant" />
                                    <span>Tambah Layanan Spesifik</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleToggleHideUtama(service.id, service.status)
                                      setActiveMenuId(null)
                                    }}
                                    className="w-full text-left px-4.5 py-2.5 text-label-md font-bold text-on-surface hover:bg-surface-container flex items-center gap-3 cursor-pointer"
                                  >
                                    <Icon name={service.status ? 'visibility_off' : 'visibility'} size={18} className="text-on-surface-variant/80" />
                                    <span>{service.status ? 'Sembunyikan' : 'Tampilkan'}</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteUtama(service.id)
                                      setActiveMenuId(null)
                                    }}
                                    className="w-full text-left px-4.5 py-2.5 text-label-md font-bold text-error hover:bg-error-container/30 flex items-center gap-3 cursor-pointer"
                                  >
                                    <Icon name="delete" size={18} className="text-error" />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Indented Specific Items if any exist */}
                      {service.items && service.items.length > 0 && (
                        <div className="mt-4 pl-4.5 flex flex-col gap-2 border-l border-outline-variant/20 max-w-[600px] text-left">
                          {service.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-1">
                              <span className="text-body-md font-semibold text-on-surface-variant/80">{item.name}</span>
                              <div className="flex items-center gap-6">
                                <span className="text-body-md font-extrabold text-on-surface-variant font-sans">
                                  Rp. {item.price.toLocaleString('id-ID')} / {item.unit}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleOpenSpesifikModal(service, item)}
                                    className="p-1 text-primary hover:bg-primary-container/30 rounded-md cursor-pointer"
                                    title="Edit Item"
                                  >
                                    <Icon name="edit" size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSpesifik(service.id, item.id)}
                                    className="p-1 text-error hover:bg-error-container/30 rounded-md cursor-pointer"
                                    title="Hapus Item"
                                  >
                                    <Icon name="delete" size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              
              // --- LAYANAN TAMBAHAN SECTION ---
              layananTambahan.length === 0 ? (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="mb-6 relative">
                    <svg viewBox="0 0 200 200" className="w-56 h-56 text-primary">
                      {/* Identical stacked drawer boxes illustration */}
                      <rect x="70" y="90" width="70" height="70" fill="#004d62" rx="6" />
                      <circle cx="105" cy="125" r="5" fill="#ffffff" />
                      <rect x="75" y="45" width="60" height="42" fill="#003543" rx="6" />
                      <circle cx="105" cy="66" r="4" fill="#ffffff" />
                      <path d="M40 70 C40 50, 60 50, 60 70 L55 140 L45 140 Z" fill="#0a6780" />
                      <circle cx="50" cy="45" r="12" fill="#ffdea4" />
                      <path d="M40 45 C40 35, 60 35, 60 45 Z" fill="#171d1e" />
                      <circle cx="115" cy="25" r="14" fill="#eff5f6" stroke="#0a6780" strokeWidth="2" />
                      <text x="115" y="30" textAnchor="middle" fill="#0a6780" fontWeight="bold" fontSize="16">!</text>
                      <rect x="155" y="120" width="16" height="20" fill="#70787c" rx="2" />
                      <line x1="163" y1="120" x2="163" y2="90" stroke="#70787c" strokeWidth="2" />
                      <circle cx="163" cy="85" r="5" fill="#2d6a44" />
                      <circle cx="156" cy="98" r="4.5" fill="#2d6a44" />
                      <circle cx="170" cy="108" r="4.5" fill="#2d6a44" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-on-surface font-sans mb-1.5">Tambahkan Layanan Dulu!</h2>
                  <p className="text-body-md text-on-surface-variant/70 font-semibold max-w-sm">
                    Silahkan tekan tombol layanan, untuk menambahkan layanan
                  </p>
                </div>
              ) : (
                /* Grouped list */
                <div className="flex flex-col gap-4">
                  {layananTambahan.map((group) => (
                    <div
                      key={group.id}
                      className={`border border-outline-variant/40 rounded-2xl p-5.5 bg-white hover:shadow-sm flex transition-all ${
                        !group.status ? 'opacity-55' : ''
                      }`}
                    >
                      {/* Left Side: Category and its specific list items */}
                      <div className="flex-1 flex flex-col gap-3 text-left">
                        <h3 className="text-lg font-bold text-on-surface font-sans flex items-center gap-2">
                          {group.name}
                          {!group.status && (
                            <Icon name="visibility_off" size={18} className="text-on-surface-variant/65" />
                          )}
                        </h3>
                        
                        {/* Indented Specific Items */}
                        <div className="pl-4.5 flex flex-col gap-2 border-l border-outline-variant/20 max-w-[600px]">
                          {group.items.length === 0 ? (
                            <p className="text-body-sm font-semibold text-on-surface-variant/50 italic">Belum ada item spesifik</p>
                          ) : (
                            group.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center py-1">
                                <span className="text-body-md font-semibold text-on-surface-variant/80">{item.name}</span>
                                <span className="text-body-md font-extrabold text-on-surface-variant font-sans">
                                  Rp. {item.price.toLocaleString('id-ID')} / {item.unit}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right Side: Edit & Vertical Menu */}
                      <div className="flex items-center gap-4.5 pl-6">
                        <button
                          onClick={() => handleOpenTambahanGroupModal(group)}
                          className="border border-outline-variant/60 rounded-xl px-4 py-2 text-label-md font-bold text-on-surface-variant flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer bg-white h-10"
                        >
                          <Icon name="edit" size={18} />
                          <span>Edit</span>
                        </button>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuType('tambahan')
                              setActiveMenuId(activeMenuId === group.id ? null : group.id)
                            }}
                            className="w-10 h-10 hover:bg-surface-container rounded-xl flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
                          >
                            <Icon name="more_vert" size={22} />
                          </button>

                          {activeMenuType === 'tambahan' && activeMenuId === group.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 mt-1 w-56 bg-white border border-outline-variant/40 rounded-2xl shadow-lg py-2.5 z-10 font-sans"
                            >
                              <button
                                onClick={() => {
                                  handleOpenSpesifikModal(group)
                                  setActiveMenuId(null)
                                }}
                                className="w-full text-left px-4.5 py-2.5 text-label-md font-bold text-on-surface hover:bg-surface-container flex items-center gap-3 cursor-pointer"
                              >
                                <Icon name="add" size={18} className="text-on-surface-variant" />
                                <span>Tambah Layanan Spesifik</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleToggleHideTambahanGroup(group.id, group.status)
                                  setActiveMenuId(null)
                                }}
                                className="w-full text-left px-4.5 py-2.5 text-label-md font-bold text-on-surface hover:bg-surface-container flex items-center gap-3 cursor-pointer"
                              >
                                <Icon name={group.status ? 'visibility_off' : 'visibility'} size={18} className="text-on-surface-variant/80" />
                                <span>{group.status ? 'Sembunyikan' : 'Tampilkan'}</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteTambahanGroup(group.id)
                                  setActiveMenuId(null)
                                }}
                                className="w-full text-left px-4.5 py-2.5 text-label-md font-bold text-error hover:bg-error-container/30 flex items-center gap-3 cursor-pointer"
                              >
                                <Icon name="delete" size={18} className="text-error" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Bottom-Right Panel Button (Triggers correct add modal) */}
            <div className="flex justify-end mt-6.5">
              {activeTab === 'utama' ? (
                <Button
                  variant="primary"
                  appearance="solid"
                  startIcon={<Icon name="add" size={20} />}
                  onClick={() => handleOpenUtamaModal()}
                  className="font-bold rounded-xl cursor-pointer bg-primary text-white hover:brightness-95 px-5 h-11"
                >
                  Tambahkan Layanan
                </Button>
              ) : (
                <Button
                  variant="primary"
                  appearance="solid"
                  startIcon={<Icon name="add" size={20} />}
                  onClick={() => handleOpenTambahanGroupModal()}
                  className="font-bold rounded-xl cursor-pointer bg-primary text-white hover:brightness-95 px-5 h-11"
                >
                  Tambahkan Layanan Tambahan
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 1. MODAL: TAMBAH / EDIT LAYANAN UTAMA                    */}
      {/* ======================================================== */}
      {(activeModal === 'tambah_utama' || activeModal === 'edit_utama') && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white border border-outline-variant/30 rounded-3xl w-full max-w-lg shadow-2xl p-7 text-left animate-scale-up">
            
            {/* Header with back button */}
            <div className="flex items-center gap-3 mb-6.5">
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-xl hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
              >
                <Icon name="arrow_back" size={22} className="text-on-surface" />
              </button>
              <h2 className="text-xl font-bold text-on-surface">
                {activeModal === 'edit_utama' ? 'Edit Layanan' : 'Tambah Layanan'}
              </h2>
            </div>

            <form onSubmit={handleSaveUtama} className="flex flex-col gap-5.5">
              {/* Input: Nama Layanan */}
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Nama Layanan</label>
                <input
                  type="text"
                  placeholder="Masukkan Nama Layanan..."
                  value={utamaForm.name}
                  onChange={(e) => setUtamaForm({ ...utamaForm, name: e.target.value })}
                  className={`w-full bg-surface-container-low border ${
                    errors.name ? 'border-error' : 'border-primary-container'
                  } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all`}
                />
                {errors.name && <p className="mt-1 text-body-sm text-error">{errors.name}</p>}
              </div>

              {/* Textarea: Deskripsi */}
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Deskripsi</label>
                <textarea
                  placeholder="Layanan cuci pakaian..."
                  value={utamaForm.description}
                  onChange={(e) => setUtamaForm({ ...utamaForm, description: e.target.value })}
                  rows="3.5"
                  className="w-full bg-surface-container-low border border-primary-container rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Price & Unit fields row */}
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Harga</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Masukkan Harga"
                      value={utamaForm.price}
                      onChange={(e) => setUtamaForm({ ...utamaForm, price: e.target.value })}
                      className={`w-full bg-surface-container-low border ${
                        errors.price ? 'border-error' : 'border-primary-container'
                      } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all font-sans`}
                    />
                    {errors.price && <p className="mt-1 text-body-sm text-error">{errors.price}</p>}
                  </div>

                  {/* Unit Custom Dropdown Select */}
                  <div className="relative w-36">
                    <button
                      type="button"
                      onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                      className="w-full h-full bg-surface-container-low border border-primary-container rounded-xl px-4 flex items-center justify-between text-body-md text-primary font-semibold cursor-pointer select-none"
                    >
                      <span>/ {utamaForm.unit}</span>
                      <Icon name="arrow_drop_down" size={20} className="text-primary" />
                    </button>

                    {unitDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-outline-variant/35 rounded-xl shadow-lg z-20 py-1.5 font-sans">
                        {['Kg', 'Pcs'].map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => {
                              setUtamaForm({ ...utamaForm, unit: u })
                              setUnitDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-body-md font-semibold hover:bg-surface-container-low transition-colors text-on-surface ${
                              utamaForm.unit === u ? 'bg-primary-container/40 text-on-primary-container' : ''
                            }`}
                          >
                            / {u}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button Align Bottom Right */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-primary-container text-on-primary-container font-bold py-3 px-6 rounded-2xl hover:brightness-95 transition-all cursor-pointer shadow-xs font-sans text-label-md"
                >
                  {activeModal === 'edit_utama' ? 'Simpan Layanan' : 'Tambahkan Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2A. MODAL: EDIT KELOMPOK LAYANAN TAMBAHAN                */}
      {/* ======================================================== */}
      {activeModal === 'edit_tambahan' && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white border border-outline-variant/30 rounded-3xl w-full max-w-lg shadow-2xl p-7 text-left animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6.5">
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-xl hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
              >
                <Icon name="arrow_back" size={22} className="text-on-surface" />
              </button>
              <h2 className="text-xl font-bold text-on-surface">
                Edit Layanan Tambahan
              </h2>
            </div>

            <form onSubmit={handleSaveTambahanGroup} className="flex flex-col gap-5.5">
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Nama Kelompok Layanan</label>
                <input
                  type="text"
                  placeholder="Contoh: Selimut, Baju Putih..."
                  value={tambahanForm.name}
                  onChange={(e) => setTambahanForm({ ...tambahanForm, name: e.target.value })}
                  className={`w-full bg-surface-container-low border ${
                    errors.name ? 'border-error' : 'border-primary-container'
                  } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all`}
                />
                {errors.name && <p className="mt-1 text-body-sm text-error">{errors.name}</p>}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-primary-container text-on-primary-container font-bold py-3 px-6 rounded-2xl hover:brightness-95 transition-all cursor-pointer shadow-xs font-sans text-label-md"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2B. MODAL: TAMBAH LAYANAN TAMBAHAN (Tambah Layanan Tambahan.png) */}
      {/* ======================================================== */}
      {activeModal === 'tambah_tambahan' && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white border border-outline-variant/30 rounded-3xl w-full max-w-lg shadow-2xl p-7 text-left animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6.5">
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-xl hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
              >
                <Icon name="arrow_back" size={22} className="text-on-surface" />
              </button>
              <h2 className="text-xl font-bold text-on-surface">
                Tambah Layanan Tambahan
              </h2>
            </div>

            <form onSubmit={handleSaveTambahanGroup} className="flex flex-col gap-5.5">
              {/* Input: Pilih Layanan Tambahan */}
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Pilih Layanan Tambahan</label>
                <input
                  type="text"
                  placeholder="Masukkan Harga"
                  value={spesifikForm.groupNameText}
                  onChange={(e) => setSpesifikForm({ ...spesifikForm, groupNameText: e.target.value })}
                  className={`w-full bg-surface-container-low border ${
                    errors.groupNameText ? 'border-error' : 'border-primary-container'
                  } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all`}
                />
                {errors.groupNameText && <p className="mt-1 text-body-sm text-error">{errors.groupNameText}</p>}
              </div>

              {/* Input: Nama Layanan Spesifik */}
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Nama Layanan Spesifik</label>
                <input
                  type="text"
                  placeholder="Pemutih + Pelembut"
                  value={spesifikForm.name}
                  onChange={(e) => setSpesifikForm({ ...spesifikForm, name: e.target.value })}
                  className={`w-full bg-surface-container-low border ${
                    errors.name ? 'border-error' : 'border-primary-container'
                  } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all`}
                />
                {errors.name && <p className="mt-1 text-body-sm text-error">{errors.name}</p>}
              </div>

              {/* Price amount and unit dropdown select */}
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Harga</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Masukkan Harga"
                      value={spesifikForm.price}
                      onChange={(e) => setSpesifikForm({ ...spesifikForm, price: e.target.value })}
                      className={`w-full bg-surface-container-low border ${
                        errors.price ? 'border-error' : 'border-primary-container'
                      } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all font-sans`}
                    />
                    {errors.price && <p className="mt-1 text-body-sm text-error">{errors.price}</p>}
                  </div>

                  {/* Custom dropdown selector */}
                  <div className="relative w-36">
                    <button
                      type="button"
                      onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                      className="w-full h-full bg-surface-container-low border border-primary-container rounded-xl px-4 flex items-center justify-between text-body-md text-primary font-semibold cursor-pointer select-none"
                    >
                      <span>/ {spesifikForm.unit}</span>
                      <Icon name="arrow_drop_down" size={20} className="text-primary" />
                    </button>

                    {unitDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-outline-variant/35 rounded-xl shadow-lg z-20 py-1.5 font-sans font-medium">
                        {['Pcs', 'Kg', 'Pasang', 'Lembar'].map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => {
                              setSpesifikForm({ ...spesifikForm, unit: u })
                              setUnitDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-body-md font-semibold hover:bg-surface-container-low transition-colors text-on-surface ${
                              spesifikForm.unit === u ? 'bg-primary-container/40 text-on-primary-container' : ''
                            }`}
                          >
                            / {u}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button Align Bottom Right */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-primary-container text-on-primary-container font-bold py-3 px-6 rounded-2xl hover:brightness-95 transition-all cursor-pointer shadow-xs font-sans text-label-md"
                >
                  Tambahkan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MODAL: TAMBAH / EDIT ITEM SPESIFIK (LAYANAN SPESIFIK) */}
      {/* ======================================================== */}
      {(activeModal === 'tambah_spesifik' || activeModal === 'edit_spesifik') && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white border border-outline-variant/30 rounded-3xl w-full max-w-lg shadow-2xl p-7 text-left animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6.5">
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-xl hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
              >
                <Icon name="arrow_back" size={22} className="text-on-surface" />
              </button>
              <h2 className="text-xl font-bold text-on-surface">
                Tambah Layanan Spesifik
              </h2>
            </div>

            <form onSubmit={handleSaveSpesifik} className="flex flex-col gap-5.5">
              {/* Select parent category group */}
              <div className="block relative">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Pilih Layanan Tambahan</label>
                
                {!showNewGroupInput ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                      className={`w-full bg-surface-container-low border ${
                        errors.groupId ? 'border-error' : 'border-primary-container'
                      } rounded-xl px-4 py-3 flex items-center justify-between text-body-md text-on-surface-variant font-semibold cursor-pointer select-none text-left`}
                    >
                      <span>
                        {layananTambahan.find(x => x.id === spesifikForm.groupId)?.name || 
                         layananUtama.find(x => x.id === spesifikForm.groupId)?.name || 
                         'Pilih Layanan'}
                      </span>
                      <Icon name="arrow_drop_down" size={20} className="text-primary" />
                    </button>
                    {errors.groupId && <p className="mt-1 text-body-sm text-error">{errors.groupId}</p>}

                    {groupDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-outline-variant/30 rounded-2xl shadow-xl z-20 py-2 font-sans max-h-60 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewGroupInput(true)
                            setGroupDropdownOpen(false)
                          }}
                          className="w-full text-left px-4.5 py-3 text-body-md font-bold text-primary hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer border-b border-outline-variant/10"
                        >
                          <Icon name="add" size={18} />
                          Tambah kelompok tambahan baru
                        </button>
                        
                        {/* Section 1: Layanan Utama */}
                        <div className="px-4.5 py-1.5 text-[11px] font-extrabold text-on-surface-variant/50 uppercase tracking-wider bg-surface-container-low/30">
                          Layanan Utama
                        </div>
                        {layananUtama.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => {
                              setSpesifikForm({ ...spesifikForm, groupId: service.id })
                              setGroupDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4.5 py-2.5 text-body-md font-semibold hover:bg-surface-container-low transition-colors text-on-surface ${
                              spesifikForm.groupId === service.id ? 'bg-primary-container/30 text-on-primary-container' : ''
                            }`}
                          >
                            {service.name}
                          </button>
                        ))}

                        {/* Section 2: Layanan Tambahan */}
                        <div className="px-4.5 py-1.5 text-[11px] font-extrabold text-on-surface-variant/50 uppercase tracking-wider bg-surface-container-low/30 mt-1">
                          Layanan Tambahan
                        </div>
                        {layananTambahan.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setSpesifikForm({ ...spesifikForm, groupId: g.id })
                              setGroupDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4.5 py-2.5 text-body-md font-semibold hover:bg-surface-container-low transition-colors text-on-surface ${
                              spesifikForm.groupId === g.id ? 'bg-primary-container/30 text-on-primary-container' : ''
                            }`}
                          >
                            {g.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Inline Group Name Input creator */
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Ketik Kelompok Baru (contoh: Jas)..."
                      value={newGroupNameInline}
                      onChange={(e) => setNewGroupNameInline(e.target.value)}
                      className={`flex-1 bg-surface-container-low border ${
                        errors.newGroupName ? 'border-error' : 'border-primary-container'
                      } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewGroupInput(false)}
                      className="border border-outline-variant rounded-xl px-3 py-3 text-label-sm font-bold text-on-surface-variant cursor-pointer hover:bg-surface-container"
                    >
                      Batal
                    </button>
                    {errors.newGroupName && <p className="mt-1 text-body-sm text-error">{errors.newGroupName}</p>}
                  </div>
                )}
              </div>

              {/* Input: Nama Item Spesifik */}
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Nama Layanan Spesifik</label>
                <input
                  type="text"
                  placeholder="Contoh: Pemutih + Pelembut, Selimut Kecil..."
                  value={spesifikForm.name}
                  onChange={(e) => setSpesifikForm({ ...spesifikForm, name: e.target.value })}
                  className={`w-full bg-surface-container-low border ${
                    errors.name ? 'border-error' : 'border-primary-container'
                  } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all`}
                />
                {errors.name && <p className="mt-1 text-body-sm text-error">{errors.name}</p>}
              </div>

              {/* Input: Harga & Unit Dropdown select */}
              <div className="block">
                <label className="mb-2 block text-label-md text-on-surface font-bold">Harga</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Masukkan Harga"
                      value={spesifikForm.price}
                      onChange={(e) => setSpesifikForm({ ...spesifikForm, price: e.target.value })}
                      className={`w-full bg-surface-container-low border ${
                        errors.price ? 'border-error' : 'border-primary-container'
                      } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all font-sans`}
                    />
                    {errors.price && <p className="mt-1 text-body-sm text-error">{errors.price}</p>}
                  </div>

                  {/* Custom Unit select dropdown */}
                  <div className="relative w-36">
                    <button
                      type="button"
                      onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                      className="w-full h-full bg-surface-container-low border border-primary-container rounded-xl px-4 flex items-center justify-between text-body-md text-primary font-semibold cursor-pointer select-none"
                    >
                      <span>/ {spesifikForm.unit}</span>
                      <Icon name="arrow_drop_down" size={20} className="text-primary" />
                    </button>

                    {unitDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-outline-variant/35 rounded-xl shadow-lg z-20 py-1.5 font-sans">
                        {['Pcs', 'Kg', 'Pasang', 'Lembar'].map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => {
                              setSpesifikForm({ ...spesifikForm, unit: u })
                              setUnitDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-body-md font-semibold hover:bg-surface-container-low transition-colors text-on-surface ${
                              spesifikForm.unit === u ? 'bg-primary-container/40 text-on-primary-container' : ''
                            }`}
                          >
                            / {u}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-primary-container text-on-primary-container font-bold py-3 px-6 rounded-2xl hover:brightness-95 transition-all cursor-pointer shadow-xs font-sans text-label-md"
                >
                  Tambahkan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6.5 max-w-sm w-full shadow-lg border border-outline-variant/30 flex flex-col gap-5 text-left">
            <div className="flex items-center gap-3 text-error">
              <Icon name="warning" size={28} className="text-error" />
              <h3 className="text-xl font-bold text-on-surface font-sans">Konfirmasi Hapus</h3>
            </div>
            
            <p className="text-body-md text-on-surface-variant font-medium leading-relaxed">
              {deleteConfirm.message}
            </p>
            
            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="border border-outline-variant hover:bg-surface-container text-on-surface-variant font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-label-sm font-sans"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { type, id, extraId } = deleteConfirm
                  setDeleteConfirm(null)
                  try {
                    if (type === 'utama') {
                      await productService.deleteLayananUtama(id)
                    } else if (type === 'tambahan') {
                      await productService.deleteLayananTambahanGroup(id)
                    } else if (type === 'spesifik') {
                      await productService.deleteLayananSpesifik(extraId, id)
                    }
                    await loadData()
                  } catch (err) {
                    console.error(err)
                  }
                }}
                className="bg-error text-white hover:bg-error/95 font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs text-label-sm font-sans"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
