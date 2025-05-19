import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-9xl font-extrabold text-primary dark:text-blue-400">404</h1>
        
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Halaman Tidak Ditemukan</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Halaman mungkin telah dipindahkan atau tidak tersedia.
          </p>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              Kembali ke Beranda
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/contact">
              <Search className="h-5 w-5" />
              Hubungi Kami
            </Link>
          </Button>
        </div>
        
        <div className="mt-16">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Jika Anda yakin ada kesalahan, silakan hubungi dukungan pelanggan kami.
          </p>
        </div>
      </div>
    </div>
  );
}
