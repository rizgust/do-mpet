import Link from 'next/link'
import { ArrowLeftRight, HomeIcon, Settings, Wallet } from 'lucide-react'
import AddTrxForm from '@/components/form/modal-trx-add';
import { getExpenseSummary, getPrimitiveModel, operationPrimitiveModel } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function getColorForPercentage(percentage: number): string {
  // Convert percentage to a hue value (120 for green, 0 for red)
  if (percentage > 100) {
    return `hsl(${0}, 100%, 50%)`
  }
  const hue = ((1 - ((percentage)/100)) * 120).toString(10)
  return `hsl(${hue}, 100%, 30%)`
}

export default async function Home() {

  const { data : mutations} = await getPrimitiveModel('mutations')
  const { data : funds} = await getPrimitiveModel('funds')
  const { data : _categories} = await getPrimitiveModel('categories')
  const categories = _categories.sort((a: any, b: any) => a.name.localeCompare(b.name))
  const source = funds.filter((fund: any) => fund.is_wallet === true).sort((a: any, b: any) => a.name.localeCompare(b.name))
  const allocation = funds.filter((fund: any) => fund.is_expense === true).sort((a: any, b: any) => a.name.localeCompare(b.name))
  const {data: summaries} = await getExpenseSummary()

  const salary = mutations.filter((mutation: any) => mutation.category === 'SALARY').sort((a: any, b: any) => b.trx_date.localeCompare(a.trx_date))[0]
  const totalExpense = summaries.reduce((total: any, summary: any) => total + summary.expense_amount, 0)
  const savings = (100*parseFloat(totalExpense)/salary.amount)
  const savingColor = getColorForPercentage(100-savings)
  console.log(totalExpense)

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">My App</h1>
        </div>
      </header>

      <main className="flex-grow overflow-auto">
        <div className="grid gap-4 container mx-auto px-4 py-8">
          <Card key={'savings'} style={{ backgroundColor: savingColor }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{"SAVING"}</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  (salary.amount-totalExpense).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'IDR',
                  })
                } ({savings.toFixed(2)}%)
              </div>
            </CardContent>
          </Card>
          {source.map((wallet) => (
            <Card key={wallet.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{wallet.name}</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    wallet.balance? wallet.balance.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'IDR',
                    }) : 0
                  }
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="container mx-auto px-4 py-8">          
          {/* Sample content to demonstrate scrolling */}
          {summaries.map((item, i) => {

          const barColor = getColorForPercentage(item.expense_percentage)
          return(
            <div key={item.allocation_name} className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="w-1/2 text-sm font-medium">{item.allocation_name}</span>
                <span className="w-1/2 text-right text-sm text-muted-foreground">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.expense_amount)} ({item.expense_percentage.toFixed(2)}%)</span>
              </div>
              <div className="h-8 w-full bg-secondary">
                <div
                  className="h-full bg-gray transition-all duration-300 ease-in-out text-right"
                  style={{ 
                    width: `${item.expense_percentage>100 ? 100 : item.expense_percentage}%`,
                    backgroundColor: barColor
                  }}
                />
              </div>
          </div>
          )})}
        </div>
      </main>


      <footer className="bg-gray-700 text-white py-4 flex-shrink-0 relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <nav className="w-3/4 py-2 px-4 flex justify-between">
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <ArrowLeftRight className="h-6 w-6" />
              <span className="text-xs">Transactions</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1" prefetch={false}>
              <Settings className="h-6 w-6" />
              <span className="text-xs">Settings</span>
            </Link>
          </nav>
          <AddTrxForm source={source} allocation={allocation} categories={categories}/>   
        </div>
      </footer>
    </div>
  );
}