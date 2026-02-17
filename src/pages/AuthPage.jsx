import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axios'
import { loginUser } from '../store/slices/clientSlice'

const emailRule = {
  required: 'Email zorunludur',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Gecerli bir email adresi gir',
  },
}

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'signup' ? 'signup' : 'login',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [roles, setRoles] = useState([])

  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loginForm = useForm()
  const signupForm = useForm({
    defaultValues: {
      role_id: '3',
    },
  })

  const selectedRole = signupForm.watch('role_id')

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'signup' && activeTab !== 'signup') {
      setActiveTab('signup')
      return
    }

    if (tabParam !== 'signup' && activeTab !== 'login') {
      setActiveTab('login')
    }
  }, [activeTab, searchParams])

  useEffect(() => {
    const fetchRoles = async () => {
      if (activeTab !== 'signup') {
        return
      }

      setIsLoading(true)
      try {
        const response = await axiosInstance.get('/roles')
        setRoles(response.data)
      } catch {
        setError('Roller yuklenemedi. Lutfen tekrar dene.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [activeTab])

  const onLoginSubmit = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        }),
      )

      if (result.success) {
        toast.success('Basariyla giris yaptin.')
        navigate(-1)
      } else {
        toast.error(result.error)
        setError(result.error)
      }
    } catch {
      setError('Giris sirasinda beklenmeyen bir hata olustu.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpSubmit = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      const submitData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: Number(data.role_id),
      }

      if (data.role_id === '2') {
        submitData.store = {
          name: data.store_name,
          phone: data.store_phone,
          tax_no: data.store_tax_no,
          bank_account: data.store_bank_account,
        }
      }

      await axiosInstance.post('/signup', submitData)
      toast.success('Kullanici olusturuldu. Aktivasyon mailini kontrol et.')
      navigate(-1)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Kayit sirasinda bir hata olustu.'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const changeTab = (tab) => {
    setActiveTab(tab)
    setError(null)

    const next = new URLSearchParams(searchParams)
    if (tab === 'signup') {
      next.set('tab', 'signup')
    } else {
      next.delete('tab')
    }

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true })
    }
  }

  return (
    <div className="page-enter">
      <section className="page-shell">
        <div className="surface-card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            <aside className="relative overflow-hidden bg-ink p-8 text-white sm:p-10">
              <div className="absolute -right-20 top-20 h-48 w-48 rounded-full bg-[#d9a520]/25 blur-3xl" />
              <div className="absolute -left-16 bottom-8 h-40 w-40 rounded-full bg-[#0f5c4a]/35 blur-3xl" />

              <p className="chip mb-4">Ayrik Account</p>
              <h1 className="text-3xl font-bold sm:text-4xl">Alisveris deneyimini senkronize et.</h1>
              <p className="mt-4 max-w-md text-sm text-white/80">
                Kayit oldugunda adres, kart ve siparis gecmisini tek panelde yonetebilirsin.
              </p>

              <div className="mt-10 space-y-4 text-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Guvenli oturum yonetimi
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <LockKeyhole className="h-4 w-4" />
                  Siparis ve odeme verileri korumali
                </div>
              </div>
            </aside>

            <div className="bg-[#fffdf8] p-6 sm:p-8">
              <div className="mb-6 grid grid-cols-2 rounded-full bg-[#ece8dc] p-1">
                <button
                  type="button"
                  onClick={() => changeTab('login')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'login' ? 'bg-ink text-white' : 'text-muted hover:text-ink'
                  }`}
                >
                  Giris Yap
                </button>
                <button
                  type="button"
                  onClick={() => changeTab('signup')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'signup' ? 'bg-ink text-white' : 'text-muted hover:text-ink'
                  }`}
                >
                  Kayit Ol
                </button>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-[#e6b0b0] bg-[#fdf1f1] px-4 py-3 text-sm text-[#a12f2f]">
                  {error}
                </div>
              )}

              {activeTab === 'login' ? (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
                    <input type="email" {...loginForm.register('email', emailRule)} className="input-field" />
                    {loginForm.formState.errors.email && (
                      <p className="mt-1 text-xs text-[#a12f2f]">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-ink">Sifre</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        {...loginForm.register('password', { required: 'Sifre zorunludur' })}
                        className="input-field pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                      >
                        {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="mt-1 text-xs text-[#a12f2f]">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <label className="inline-flex items-center gap-2 text-sm text-muted">
                    <input type="checkbox" {...loginForm.register('rememberMe')} />
                    Beni hatirla
                  </label>

                  <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center disabled:opacity-50">
                    {isLoading ? 'Giris yapiliyor...' : 'Giris Yap'}
                  </button>
                </form>
              ) : (
                <form onSubmit={signupForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-ink">Ad Soyad</label>
                    <input
                      type="text"
                      {...signupForm.register('name', {
                        required: 'Ad Soyad zorunludur',
                        minLength: { value: 3, message: 'En az 3 karakter olmali' },
                      })}
                      className="input-field"
                    />
                    {signupForm.formState.errors.name && (
                      <p className="mt-1 text-xs text-[#a12f2f]">{signupForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
                    <input type="email" {...signupForm.register('email', emailRule)} className="input-field" />
                    {signupForm.formState.errors.email && (
                      <p className="mt-1 text-xs text-[#a12f2f]">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-ink">Sifre</label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        {...signupForm.register('password', {
                          required: 'Sifre zorunludur',
                          minLength: { value: 8, message: 'En az 8 karakter olmali' },
                          validate: {
                            hasNumber: (value) => /\d/.test(value) || 'En az bir rakam olmali',
                            hasUpperCase: (value) => /[A-Z]/.test(value) || 'En az bir buyuk harf olmali',
                            hasLowerCase: (value) => /[a-z]/.test(value) || 'En az bir kucuk harf olmali',
                            hasSpecialChar: (value) =>
                              /[!@#$%^&*.,;:'"(){}[\]<>?/\\|_+-=]/.test(value) ||
                              'En az bir ozel karakter olmali',
                          },
                        })}
                        className="input-field pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                      >
                        {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="mt-1 text-xs text-[#a12f2f]">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-ink">Sifre Tekrar</label>
                    <div className="relative">
                      <input
                        type={showSignupConfirmPassword ? 'text' : 'password'}
                        {...signupForm.register('confirmPassword', {
                          required: 'Sifre tekrari zorunludur',
                          validate: (value) => value === signupForm.watch('password') || 'Sifreler ayni olmali',
                        })}
                        className="input-field pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                      >
                        {showSignupConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="mt-1 text-xs text-[#a12f2f]">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-ink">Rol</label>
                    <select {...signupForm.register('role_id')} className="input-field">
                      {roles.length > 0 ? (
                        roles.map(
                          (role) =>
                            role.code !== 'admin' && (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ),
                        )
                      ) : (
                        <option value="3">Musteri</option>
                      )}
                    </select>
                  </div>

                  {selectedRole === '2' && (
                    <div className="space-y-4 rounded-2xl border border-soft bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Magaza Bilgileri</p>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-ink">Magaza Adi</label>
                        <input
                          type="text"
                          {...signupForm.register('store_name', {
                            required: 'Magaza adi zorunludur',
                            minLength: { value: 3, message: 'En az 3 karakter olmali' },
                          })}
                          className="input-field"
                        />
                        {signupForm.formState.errors.store_name && (
                          <p className="mt-1 text-xs text-[#a12f2f]">{signupForm.formState.errors.store_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-ink">Telefon</label>
                        <input
                          type="tel"
                          {...signupForm.register('store_phone', {
                            required: 'Telefon zorunludur',
                            pattern: {
                              value: /^(\+90|0)?[0-9]{10}$/,
                              message: 'Gecerli bir telefon numarasi gir',
                            },
                          })}
                          className="input-field"
                        />
                        {signupForm.formState.errors.store_phone && (
                          <p className="mt-1 text-xs text-[#a12f2f]">{signupForm.formState.errors.store_phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-ink">Vergi No</label>
                        <input
                          type="text"
                          {...signupForm.register('store_tax_no', {
                            required: 'Vergi no zorunludur',
                            pattern: {
                              value: /^T\d{9}V\d{2}$/,
                              message: 'Format: TXXXXXXXXXVXX',
                            },
                          })}
                          className="input-field"
                        />
                        {signupForm.formState.errors.store_tax_no && (
                          <p className="mt-1 text-xs text-[#a12f2f]">
                            {signupForm.formState.errors.store_tax_no.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-ink">IBAN</label>
                        <input
                          type="text"
                          {...signupForm.register('store_bank_account', {
                            required: 'IBAN zorunludur',
                            pattern: {
                              value: /^TR\d{2}\d{5}[A-Z0-9]{17}$/,
                              message: 'Gecerli bir TR IBAN gir',
                            },
                          })}
                          className="input-field"
                        />
                        {signupForm.formState.errors.store_bank_account && (
                          <p className="mt-1 text-xs text-[#a12f2f]">
                            {signupForm.formState.errors.store_bank_account.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center disabled:opacity-50">
                    {isLoading ? 'Kayit olusturuluyor...' : 'Kayit Ol'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AuthPage
