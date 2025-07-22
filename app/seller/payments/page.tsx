"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Edit2, Trash2, Building2 } from "lucide-react"
import { useSeller } from "../contexts/SellerContext"

interface PaymentFormData {
  type: "card" | "bank"
  cardNumber?: string
  cardholderName?: string
  expiryDate?: string
  cvv?: string
  bankName?: string
  accountNumber?: string
  accountHolderName?: string
}

export default function SellerPayments() {
  const { state, dispatch } = useSeller()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<string | null>(null)
  const [formData, setFormData] = useState<PaymentFormData>({
    type: "card",
  })

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPaymentMethod = {
      id: editingPayment || Date.now().toString(),
      ...formData,
      isDefault: state.paymentMethods.length === 0,
    }

    if (editingPayment) {
      // Update existing payment method logic would go here
      console.log("Update payment method:", newPaymentMethod)
    } else {
      console.log("Add new payment method:", newPaymentMethod)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({ type: "card" })
    setEditingPayment(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (payment: any) => {
    setFormData({
      type: payment.type,
      cardNumber: payment.cardNumber,
      cardholderName: payment.cardholderName,
      expiryDate: payment.expiryDate,
      cvv: payment.cvv,
      bankName: payment.bankName,
      accountNumber: payment.accountNumber,
      accountHolderName: payment.accountHolderName,
    })
    setEditingPayment(payment.id)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    console.log("Delete payment method:", id)
    // dispatch({ type: "DELETE_PAYMENT_METHOD", payload: id })
  }

  const handleSetDefault = (id: string) => {
    console.log("Set default payment method:", id)
    // dispatch({ type: "SET_DEFAULT_PAYMENT_METHOD", payload: id })
  }

  const maskCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`
  }

  const maskAccountNumber = (accountNumber: string) => {
    return `****${accountNumber.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-4">Payment Methods</h1>
            <p className="text-gray-600">Manage your payment options</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingPayment ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Payment Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "card" | "bank") => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank">Bank Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === "card" ? (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber || ""}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        value={formData.cardholderName || ""}
                        onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate || ""}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv || ""}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName || ""}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        placeholder="Bank of Ceylon"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber || ""}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        placeholder="1234567890"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        value={formData.accountHolderName || ""}
                        onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800">
                    {editingPayment ? "Update Payment Method" : "Add Payment Method"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {state.paymentMethods.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">No Payment Methods</h2>
            <p className="text-gray-600 mb-8">Add your first payment method to get started</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Payment Method
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.paymentMethods.map((payment: { id: React.Key | null | undefined; isDefault: any; type: string; cardNumber: any; cardholderName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; expiryDate: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; bankName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; accountNumber: any; accountHolderName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
              <Card key={payment.id} className={`relative ${payment.isDefault ? "ring-2 ring-black" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {payment.type === "card" ? <CreditCard className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      {payment.type === "card" ? "Credit Card" : "Bank Account"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {payment.isDefault && <Badge className="bg-black text-white">Default</Badge>}
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(payment)} className="h-8 w-8 p-0">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => typeof payment.id === "string" && handleDelete(payment.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payment.type === "card" ? (
                    <div className="text-gray-700">
                      <p className="font-mono text-lg">{maskCardNumber(payment.cardNumber || "")}</p>
                      <p>{payment.cardholderName}</p>
                      <p>Expires {payment.expiryDate}</p>
                    </div>
                  ) : (
                    <div className="text-gray-700">
                      <p className="font-semibold">{payment.bankName}</p>
                      <p className="font-mono">{maskAccountNumber(payment.accountNumber || "")}</p>
                      <p>{payment.accountHolderName}</p>
                    </div>
                  )}
                  {!payment.isDefault && typeof payment.id === "string" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => typeof payment.id === "string" && handleSetDefault(payment.id)}
                      className="w-full"
                    >
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
