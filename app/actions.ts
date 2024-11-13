'use server'

import { createServerClient } from "@/lib/supabase";
import { PublicSchema } from "@/types/database";
import { cookies } from "next/headers";

export async function operationPrimitiveModel<T extends keyof PublicSchema['Tables']>(t_name: T, identifier: string, formData: any, operationName: string, query?: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    let query;
    if (operationName === 'insert') {
      query = supabase.from(t_name).insert(formData);
    } else if (operationName === 'update') {
      query = supabase.from(t_name).update(formData).eq('id', identifier);
    } else if (operationName === 'delete') {
      query = supabase.from(t_name).delete().eq('id', identifier);
    } else {
      throw new Error('Invalid operation name');
    }

    const { data, error } = await query.select().single();

    if (error) return { error, data: null }

    return {
      error: null,
      data: data
    }
    
  } catch (error) {
    console.error('Error performing DB operation:', error)
    return { error, data: null }
  }
}


export async function getPrimitiveModel<T extends keyof PublicSchema['Tables']>(t_name: T) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data, error } = await supabase
  .from(t_name)
  .select('*')

  if (error) {
    console.error('Error fetching employees:', error);
    return {data : [], error};
  }

  return {data : data || [], error};
}

export async function getExpenseSummary(){
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data, error } = await supabase
  .rpc('get_expense_report', {
    
  })

  if (error) {
    console.error('Error fetching employees:', error);
    return {data : [], error};
  }

  return {data : data || [], error};
}
